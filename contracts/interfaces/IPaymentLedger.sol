// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Interface para o contrato PaymentLedger usado atráves do protocolo.
interface IPaymentLedger {
    function createPayment(
        address supplier,
        address payer,
        uint256 amountCents,
        uint256 deliveryId,
        string calldata pixKey
    ) external returns (uint256);
}
