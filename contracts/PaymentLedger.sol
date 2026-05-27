// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Registra obrigações de pagamento em centavos de BRL para entregas e compras.
// O valor real é liquidado via PIX off-chain, e o on-chain apenas guarda o status.
contract PaymentLedger is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant ORACLE_ROLE   = keccak256("ORACLE_ROLE");

    enum PaymentStatus { PENDING, PAID, FAILED }

    struct Payment {
        uint256       id;
        address       supplier;
        address       payer;
        uint256       amountCents;
        uint256       deliveryId;
        string        pixKey;
        PaymentStatus status;
        uint256       createdAt;
        uint256       settledAt;
        string        pixProof;
    }

    uint256 public paymentCount;
    mapping(uint256 => Payment)         public payments;
    mapping(address => uint256[])       public supplierPayments;

    // Mapeia deliveryId para paymentId para evitar duplicação de obrigação.
    mapping(uint256 => uint256)         public deliveryPayment;

    event PaymentCreated(
        uint256 indexed paymentId,
        uint256 indexed deliveryId,
        address indexed supplier,
        address payer,
        uint256 amountCents,
        string  pixKey,
        uint256 timestamp
    );
    event PaymentConfirmed(uint256 indexed paymentId, string pixProof, uint256 timestamp);
    event PaymentFailed(uint256 indexed paymentId, string reason, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Cria uma obrigação de pagamento on-chain para um delivery ou compra.
    function createPayment(
        address supplier,
        address payer,
        uint256 amountCents,
        uint256 deliveryId,
        string  calldata pixKey
    ) external onlyRole(OPERATOR_ROLE) nonReentrant returns (uint256) {
        require(supplier    != address(0),    "Invalid supplier.");
        require(payer       != address(0),    "Invalid payer.");
        require(amountCents > 0,              "Amount must be > 0.");
        require(deliveryId > 0,                "Invalid delivery id.");
        require(bytes(pixKey).length > 0,     "PIX key required.");
        require(deliveryPayment[deliveryId] == 0, "Payment already exists for this delivery.");

        uint256 pid = ++paymentCount;

        payments[pid] = Payment({
            id:          pid,
            supplier:    supplier,
            payer:       payer,
            amountCents: amountCents,
            deliveryId:  deliveryId,
            pixKey:      pixKey,
            status:      PaymentStatus.PENDING,
            createdAt:   block.timestamp,
            settledAt:   0,
            pixProof:    ""
        });

        supplierPayments[supplier].push(pid);
        deliveryPayment[deliveryId] = pid;

        emit PaymentCreated(pid, deliveryId, supplier, payer, amountCents, pixKey, block.timestamp);
        return pid;
    }

    // Marca um pagamento como confirmado e armazena a prova do PIX.
    function confirmPayment(uint256 paymentId, string calldata pixProof)
        external onlyRole(ORACLE_ROLE)
    {
        Payment storage p = payments[paymentId];
        require(p.id != 0,                           "Payment not found.");
        require(p.status == PaymentStatus.PENDING,   "Not pending.");
        require(bytes(pixProof).length > 0,          "PIX proof required.");

        p.status    = PaymentStatus.PAID;
        p.settledAt = block.timestamp;
        p.pixProof  = pixProof;

        emit PaymentConfirmed(paymentId, pixProof, block.timestamp);
    }

    // Marca um pagamento como falhado quando a liquidação não for concluída.
    function failPayment(uint256 paymentId, string calldata reason)
        external onlyRole(ORACLE_ROLE)
    {
        Payment storage p = payments[paymentId];
        require(p.id != 0,                         "Payment not found.");
        require(p.status == PaymentStatus.PENDING, "Not pending.");

        p.status    = PaymentStatus.FAILED;
        p.settledAt = block.timestamp;

        emit PaymentFailed(paymentId, reason, block.timestamp);
    }

    function getSupplierPayments(address supplier) external view returns (uint256[] memory) {
        return supplierPayments[supplier];
    }

    function getPaymentByDelivery(uint256 deliveryId) external view returns (Payment memory) {
        uint256 pid = deliveryPayment[deliveryId];
        require(pid != 0, "No payment for this delivery.");
        return payments[pid];
    }
}
