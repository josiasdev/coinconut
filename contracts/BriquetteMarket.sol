// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./interfaces/IPaymentLedger.sol";
import "./interfaces/ISustainabilityNFT.sol";

// Mercado on-chain para venda de briquetes e adubo com emissão de NFT certificado.
contract BriquetteMarket is AccessControl, ReentrancyGuard {
    bytes32 public constant FACTORY_ROLE = keccak256("FACTORY_ROLE");
    bytes32 public constant ORACLE_ROLE  = keccak256("ORACLE_ROLE");

    ISustainabilityNFT public immutable sustainabilityNFT;
    IPaymentLedger     public immutable paymentLedger;

    enum PurchaseStatus { PENDING, CONFIRMED, FAILED }

    struct Listing {
        uint256 id;
        uint256 batchId;
        uint256 weightGrams;
        uint256 pricePerKgCents;
        bool    isAdubo;
        bool    sold;
    }

    struct Purchase {
        uint256        id;
        uint256        listingId;
        address        buyer;
        uint256        amountCents;
        uint256        nftTokenId;
        uint256        paymentId;
        PurchaseStatus status;
        uint256        timestamp;
    }

    uint256 public listingCount;
    uint256 public purchaseCount;

    mapping(uint256 => Listing)  public listings;
    mapping(uint256 => Purchase) public purchases;
    mapping(address => uint256[]) public buyerPurchases;

    event Listed(uint256 indexed listingId, uint256 indexed batchId, uint256 weightGrams, uint256 pricePerKgCents, bool isAdubo);
    event PurchaseCreated(uint256 indexed purchaseId, uint256 indexed listingId, address indexed buyer, uint256 amountCents, uint256 nftTokenId, uint256 paymentId);
    event PurchaseConfirmed(uint256 indexed purchaseId, uint256 timestamp);
    event PurchaseFailed(uint256 indexed purchaseId, string reason, uint256 timestamp);

    constructor(address _sustainabilityNFT, address _paymentLedger) {
        require(_sustainabilityNFT != address(0), "Invalid NFT contract.");
        require(_paymentLedger     != address(0), "Invalid PaymentLedger.");

        sustainabilityNFT = ISustainabilityNFT(_sustainabilityNFT);
        paymentLedger     = IPaymentLedger(_paymentLedger);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Lista um lote de briquete ou adubo disponível para compra.
    function list(
        uint256 batchId,
        uint256 weightGrams,
        uint256 pricePerKgCents,
        bool    isAdubo
    ) external onlyRole(FACTORY_ROLE) returns (uint256) {
        require(weightGrams > 0,    "Weight must be > 0.");
        require(pricePerKgCents > 0, "Price must be > 0.");

        uint256 id = ++listingCount;
        listings[id] = Listing({
            id: id,
            batchId: batchId,
            weightGrams: weightGrams,
            pricePerKgCents:pricePerKgCents,
            isAdubo: isAdubo,
            sold: false
        });

        emit Listed(id, batchId, weightGrams, pricePerKgCents, isAdubo);
        return id;
    }

    // Compra um lote listado e emite o certificado sustentável imediatamente.
    function buy(
        uint256 listingId,
        string  calldata buyerPixKey
    ) external nonReentrant returns (uint256 purchaseId) {
        Listing storage l = listings[listingId];
        require(l.id != 0,   "Listing not found.");
        require(!l.sold,     "Already sold.");
        require(bytes(buyerPixKey).length > 0, "PIX key required.");

        l.sold = true;

        uint256 amountCents = _calculateTotal(l.weightGrams, l.pricePerKgCents);

        string memory productType = l.isAdubo ? "Adubo Organico" : "Briquete de Casca de Coco";
        uint256 nftTokenId = sustainabilityNFT.issue(msg.sender, l.batchId, l.weightGrams, productType);

        uint256 paymentId = paymentLedger.createPayment(
            msg.sender,
            address(this),
            amountCents,
            listingId,
            buyerPixKey
        );

        purchaseId = ++purchaseCount;
        purchases[purchaseId] = Purchase({
            id:          purchaseId,
            listingId:   listingId,
            buyer:       msg.sender,
            amountCents: amountCents,
            nftTokenId:  nftTokenId,
            paymentId:   paymentId,
            status:      PurchaseStatus.PENDING,
            timestamp:   block.timestamp
        });

        buyerPurchases[msg.sender].push(purchaseId);

        emit PurchaseCreated(purchaseId, listingId, msg.sender, amountCents, nftTokenId, paymentId);
    }

    // Confirma que o pagamento PIX da compra foi realmente recebido.
    function confirmPurchase(uint256 purchaseId) external onlyRole(ORACLE_ROLE) {
        Purchase storage p = purchases[purchaseId];
        require(p.id != 0, "Purchase not found.");
        require(p.status == PurchaseStatus.PENDING, "Not pending.");

        p.status = PurchaseStatus.CONFIRMED;
        emit PurchaseConfirmed(purchaseId, block.timestamp);
    }

    // Registra uma compra como falhada quando a confirmação PIX não for concluída.
    function failPurchase(uint256 purchaseId, string calldata reason) external onlyRole(ORACLE_ROLE) {
        Purchase storage p = purchases[purchaseId];
        require(p.id != 0, "Purchase not found.");
        require(p.status == PurchaseStatus.PENDING, "Not pending.");

        p.status = PurchaseStatus.FAILED;
        emit PurchaseFailed(purchaseId, reason, block.timestamp);
    }

    function getBuyerPurchases(address buyer) external view returns (uint256[] memory) {
        return buyerPurchases[buyer];
    }

    function calculateTotal(uint256 weightGrams, uint256 pricePerKgCents) external pure returns (uint256) {
        return _calculateTotal(weightGrams, pricePerKgCents);
    }

    function _calculateTotal(uint256 weightGrams, uint256 pricePerKgCents) internal pure returns (uint256) {
        uint256 weightKg  = weightGrams / 1000;
        uint256 remainder = weightGrams % 1000;
        uint256 total     = weightKg * pricePerKgCents;
        if (remainder > 0) total += (remainder * pricePerKgCents) / 1000;
        return total;
    }
}
