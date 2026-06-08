// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./interfaces/ICocoAsset.sol";
import "./interfaces/IPaymentLedger.sol";

// Ponto de entrada para registro de entregas, cálculo de pagamento e orquestração de batchs.
contract CoconutRegistry is Ownable, ReentrancyGuard, ERC1155Holder {
    ICocoAsset     public immutable cocoAsset;
    IPaymentLedger public immutable paymentLedger;

    uint256 public pricePerKgCents;

    struct CollectionPoint {
        string  name;
        address wallet;
        bool    active;
    }

    struct Delivery {
        uint256 id;
        address supplier;
        uint256 collectionPointId;
        uint256 weightGrams;
        uint256 batchId;
        uint256 paymentId;
        uint256 amountCents;
        uint256 timestamp;
    }

    uint256 public collectionPointCount;
    uint256 public deliveryCount;

    mapping(uint256 => CollectionPoint) public collectionPoints;
    mapping(uint256 => Delivery)        public deliveries;
    mapping(address => uint256[])       public supplierDeliveries;
    mapping(address => bool)            public authorizedOperators;

    event PriceUpdated(uint256 previous, uint256 current);
    event CollectionPointAdded(uint256 indexed id, string name, address wallet);
    event CollectionPointDeactivated(uint256 indexed id);
    event OperatorUpdated(address indexed operator, bool authorized);
    event DeliveryRegistered(
        uint256 indexed deliveryId,
        uint256 indexed batchId,
        uint256 indexed paymentId,
        address supplier,
        uint256 weightGrams,
        uint256 amountCents,
        uint256 timestamp
    );
    event BatchStageAdvanced(uint256 indexed batchId, uint256 timestamp);
    event BatchFinalizedAsAdubo(uint256 indexed batchId, uint256 timestamp);

    modifier onlyOperator() {
        require(authorizedOperators[msg.sender] || msg.sender == owner(), "Not authorized.");
        _;
    }

    constructor(address _cocoAsset, address _paymentLedger, uint256 _initialPricePerKgCents)
        Ownable(msg.sender)
    {
        require(_cocoAsset     != address(0), "Invalid CocoAsset.");
        require(_paymentLedger != address(0), "Invalid PaymentLedger.");
        require(_initialPricePerKgCents > 0,  "Price must be > 0.");

        cocoAsset      = ICocoAsset(_cocoAsset);
        paymentLedger  = IPaymentLedger(_paymentLedger);
        pricePerKgCents = _initialPricePerKgCents;
    }

    // Atualiza o preço por quilo em centavos de BRL.
    function setPrice(uint256 newPricePerKgCents) external onlyOwner {
        require(newPricePerKgCents > 0, "Price must be > 0.");
        uint256 prev = pricePerKgCents;
        pricePerKgCents = newPricePerKgCents;
        emit PriceUpdated(prev, newPricePerKgCents);
    }

    // Autoriza ou revoga um operador que pode registrar entregas e avançar batchs.
    function setOperator(address operator, bool authorized) external onlyOwner {
        require(operator != address(0), "Invalid address.");
        authorizedOperators[operator] = authorized;
        emit OperatorUpdated(operator, authorized);
    }

    // Registra um novo ponto de coleta autorizado para entrega de coco.
    function addCollectionPoint(string calldata name, address wallet) external onlyOwner {
        require(bytes(name).length > 0, "Name required.");
        require(wallet != address(0),   "Invalid wallet.");
        uint256 id = ++collectionPointCount;
        collectionPoints[id] = CollectionPoint(name, wallet, true);
        emit CollectionPointAdded(id, name, wallet);
    }

    function deactivateCollectionPoint(uint256 id) external onlyOwner {
        require(collectionPoints[id].active, "Already inactive.");
        collectionPoints[id].active = false;
        emit CollectionPointDeactivated(id);
    }

    function registerDelivery(
        address supplier,
        uint256 collectionPointId,
        uint256 weightGrams,
        string  calldata supplierPixKey
    ) external nonReentrant onlyOperator returns (uint256 deliveryId, uint256 batchId, uint256 paymentId) {
        require(collectionPoints[collectionPointId].active, "Collection point not active.");
        require(supplier != address(0),           "Invalid supplier.");
        require(weightGrams >= 1000,              "Minimum 1kg (1000g).");
        require(bytes(supplierPixKey).length > 0, "PIX key required.");

        uint256 amountCents = _calculatePayment(weightGrams);

        // CEI aplicado
        deliveryId = ++deliveryCount;

        batchId   = cocoAsset.createBatch(supplier, weightGrams);
        paymentId = paymentLedger.createPayment(
            supplier,
            msg.sender,
            amountCents,
            deliveryId,
            supplierPixKey
        );

        deliveries[deliveryId] = Delivery({
            id:                deliveryId,
            supplier:          supplier,
            collectionPointId: collectionPointId,
            weightGrams:       weightGrams,
            batchId:           batchId,
            paymentId:         paymentId,
            amountCents:       amountCents,
            timestamp:         block.timestamp
        });

        supplierDeliveries[supplier].push(deliveryId);

        emit DeliveryRegistered(deliveryId, batchId, paymentId, supplier, weightGrams, amountCents, block.timestamp);
    }

    // Avança o estado físico do batch na cadeia de produção.
    function advanceBatchStage(uint256 batchId) external onlyOperator {
        cocoAsset.advanceStage(batchId);
        emit BatchStageAdvanced(batchId, block.timestamp);
    }

    function finalizeBatchAsAdubo(uint256 batchId) external onlyOperator {
        cocoAsset.finalizeAsAdubo(batchId);
        emit BatchFinalizedAsAdubo(batchId, block.timestamp);
    }

    function getSupplierDeliveries(address supplier) external view returns (uint256[] memory) {
        return supplierDeliveries[supplier];
    }

    function calculatePayment(uint256 weightGrams) external view returns (uint256) {
        return _calculatePayment(weightGrams);
    }

    // Multiplica primeiro, depois divide
    function _calculatePayment(uint256 weightGrams) internal view returns (uint256) {
        return (weightGrams * pricePerKgCents) / 1000;
    }
}