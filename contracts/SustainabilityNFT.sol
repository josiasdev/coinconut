// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// NFT soulbound emitido para compra sustentável de briquetes ou adubo.
// Qualquer transferência é bloqueada pelo override de _update.
contract SustainabilityNFT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextTokenId;

    struct Certificate {
        address buyer;
        uint256 batchId;
        uint256 weightGrams;
        uint256 issuedAt;
        string  productType;
    }

    mapping(uint256 => Certificate) public certificates;

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 indexed batchId,
        uint256 weightGrams,
        string  productType,
        uint256 timestamp
    );

    constructor() ERC721("CoinConut Sustainability Certificate", "CCSC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Emite um certificado soulbound para uma empresa compradora.
    function issue(
        address buyer,
        uint256 batchId,
        uint256 weightGrams,
        string calldata productType
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(buyer != address(0),         "Invalid buyer.");
        require(weightGrams > 0,             "Weight must be > 0.");
        require(bytes(productType).length > 0, "Product type cannot be empty.");

        uint256 tokenId = ++_nextTokenId;

        certificates[tokenId] = Certificate({
            buyer:       buyer,
            batchId:     batchId,
            weightGrams: weightGrams,
            issuedAt:    block.timestamp,
            productType: productType
        });

        _safeMint(buyer, tokenId);

        emit CertificateIssued(tokenId, buyer, batchId, weightGrams, productType, block.timestamp);
        return tokenId;
    }

    // Override que impede transferências após mintar, tornando o NFT soulbound.
    function _update(address to, uint256 tokenId, address auth)
        internal override returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: token is non-transferable.");
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, AccessControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
