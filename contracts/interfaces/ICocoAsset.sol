// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Interface para contrato CocoAsset usado por CoconutRegistry.
interface ICocoAsset {
    function createBatch(address supplier, uint256 weightGrams) external returns (uint256);
    function advanceStage(uint256 batchId) external;
    function finalizeAsAdubo(uint256 batchId) external;
}
