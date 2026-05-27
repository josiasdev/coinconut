// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// ERC-1155 que representa a evolução física do coco através das etapas de produção.
contract CocoAsset is ERC1155, AccessControl, ReentrancyGuard {
    bytes32 public constant FACTORY_ROLE = keccak256("FACTORY_ROLE");

    uint256 public constant CASCA_RECEBIDA      = 1;
    uint256 public constant CASCA_MOIDA         = 2;
    uint256 public constant UMIDADE_AJUSTADA    = 3;
    uint256 public constant BIOMASSA_COMPACTADA = 4;
    uint256 public constant BRIQUETE_PRONTO     = 5;
    uint256 public constant ADUBO_PRONTO        = 6;

    enum Stage { RECEBIDO, MOIDO, UMIDADE_AJUSTADA, COMPACTADO, FINALIZADO }

    struct Batch {
        uint256 id;
        address supplier;
        uint256 weightGrams;
        Stage   stage;
        uint256 createdAt;
        uint256 updatedAt;
        bool    isAdubo;
    }

    uint256 private _nextBatchId;
    mapping(uint256 => Batch) public batches;

    event BatchCreated(uint256 indexed batchId, address indexed supplier, uint256 weightGrams, uint256 timestamp);
    event StageAdvanced(uint256 indexed batchId, Stage previousStage, Stage newStage, uint256 timestamp);
    event BatchFinalized(uint256 indexed batchId, bool isAdubo, uint256 timestamp);

    constructor() ERC1155("https://api.coinconut.io/metadata/{id}.json") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Cria um novo batch de coco e minta o token de casca recebida
    function createBatch(address supplier, uint256 weightGrams)
        external onlyRole(FACTORY_ROLE) nonReentrant returns (uint256)
    {
        require(supplier    != address(0), "Invalid supplier.");
        require(weightGrams > 0,           "Weight must be > 0.");

        uint256 batchId = ++_nextBatchId;

        batches[batchId] = Batch({
            id:          batchId,
            supplier:    supplier,
            weightGrams: weightGrams,
            stage:       Stage.RECEBIDO,
            createdAt:   block.timestamp,
            updatedAt:   block.timestamp,
            isAdubo:     false
        });

        _mint(msg.sender, CASCA_RECEBIDA, weightGrams, "");
        emit BatchCreated(batchId, supplier, weightGrams, block.timestamp);
        return batchId;
    }

    // Avança o batch para a próxima etapa de transformação física.
    function advanceStage(uint256 batchId)
        external onlyRole(FACTORY_ROLE) nonReentrant
    {
        Batch storage b = batches[batchId];
        require(b.id != 0,                   "Batch does not exist.");
        require(b.stage != Stage.FINALIZADO, "Batch already finalized.");

        Stage previous = b.stage;
        Stage next;
        uint256 burnId;
        uint256 mintId;

        if (previous == Stage.RECEBIDO) {
            next   = Stage.MOIDO;
            burnId = CASCA_RECEBIDA;
            mintId = CASCA_MOIDA;
        } else if (previous == Stage.MOIDO) {
            next   = Stage.UMIDADE_AJUSTADA;
            burnId = CASCA_MOIDA;
            mintId = UMIDADE_AJUSTADA;
        } else if (previous == Stage.UMIDADE_AJUSTADA) {
            next   = Stage.COMPACTADO;
            burnId = UMIDADE_AJUSTADA;
            mintId = BIOMASSA_COMPACTADA;
        } else {
            next   = Stage.FINALIZADO;
            burnId = BIOMASSA_COMPACTADA;
            mintId = BRIQUETE_PRONTO;
        }

        b.stage     = next;
        b.updatedAt = block.timestamp;

        _burn(msg.sender, burnId, b.weightGrams);
        _mint(msg.sender, mintId, b.weightGrams, "");

        emit StageAdvanced(batchId, previous, next, block.timestamp);

        if (next == Stage.FINALIZADO) {
            emit BatchFinalized(batchId, false, block.timestamp);
        }
    }
    
    // Finaliza um batch diretamente como adubo, pulando as etapas intermediárias.
    function finalizeAsAdubo(uint256 batchId)
        external onlyRole(FACTORY_ROLE) nonReentrant
    {
        Batch storage b = batches[batchId];
        require(b.id != 0,                 "Batch does not exist.");
        require(b.stage == Stage.RECEBIDO, "Only receivable batches can become adubo.");

        b.stage     = Stage.FINALIZADO;
        b.isAdubo   = true;
        b.updatedAt = block.timestamp;

        _burn(msg.sender, CASCA_RECEBIDA, b.weightGrams);
        _mint(msg.sender, ADUBO_PRONTO, b.weightGrams, "");

        emit BatchFinalized(batchId, true, block.timestamp);
    }

    function getBatch(uint256 batchId) external view returns (Batch memory) {
        require(batches[batchId].id != 0, "Batch does not exist.");
        return batches[batchId];
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC1155, AccessControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}