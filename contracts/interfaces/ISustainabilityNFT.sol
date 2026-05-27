// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


// Interface para contrato SustainabilityNFT utilizado por BriquetteMarket.
interface ISustainabilityNFT {
    function issue(address buyer, uint256 batchId, uint256 weightGrams, string calldata productType)
        external returns (uint256);
}
