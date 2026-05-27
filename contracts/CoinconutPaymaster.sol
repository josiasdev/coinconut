// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

struct UserOperation {
    address sender;
    uint256 nonce;
    bytes   initCode;
    bytes   callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes   paymasterAndData;
    bytes   signature;
}

interface IEntryPoint {
    function depositTo(address account) external payable;
    function withdrawTo(address payable withdrawAddress, uint256 withdrawAmount) external;
    function balanceOf(address account) external view returns (uint256);
}

// Paymaster ERC-4337 que patrocina o gas para transações dos fornecedores no protocolo.
contract CoinconutPaymaster is Ownable {
    IEntryPoint public immutable entryPoint;

    address public immutable coconutRegistry;
    address public immutable withdrawalManager;

    uint256 public constant VALIDATION_SUCCESS = 0;
    uint256 public constant VALIDATION_FAILED  = 1;

    mapping(address => bool) public sponsoredContracts;

    event GasSponsored(address indexed sender, address indexed target, uint256 gasUsed);
    event Deposited(uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);
    event SponsoredContractUpdated(address indexed target, bool sponsored);

    constructor(address _entryPoint, address _coconutRegistry, address _withdrawalManager)
        Ownable(msg.sender)
    {
        require(_entryPoint        != address(0), "Invalid EntryPoint.");
        require(_coconutRegistry   != address(0), "Invalid Registry.");
        require(_withdrawalManager != address(0), "Invalid WithdrawalManager.");

        entryPoint        = IEntryPoint(_entryPoint);
        coconutRegistry   = _coconutRegistry;
        withdrawalManager = _withdrawalManager;

        sponsoredContracts[_coconutRegistry]   = true;
        sponsoredContracts[_withdrawalManager]  = true;
    }

    // Valida se a transação do usuário pode ser patrocinada pelo paymaster.

    // Verifica saldo no EntryPoint e se o contrato de destino foi autorizado.
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32,
        uint256 maxCost
    ) external view returns (bytes memory context, uint256 validationData) {
        require(msg.sender == address(entryPoint), "Only EntryPoint.");
        require(entryPoint.balanceOf(address(this)) >= maxCost, "Insufficient paymaster deposit.");

        address target = _extractTarget(userOp.callData);
        require(sponsoredContracts[target], "Target contract not sponsored.");

        return (abi.encode(userOp.sender, target), VALIDATION_SUCCESS);
    }

    // Recebe o resultado da execução e emite evento de gas patrocinado.
    function postOp(
        uint8,
        bytes calldata context,
        uint256 actualGasCost,
        uint256
    ) external {
        require(msg.sender == address(entryPoint), "Only EntryPoint.");
        (address sender, address target) = abi.decode(context, (address, address));
        emit GasSponsored(sender, target, actualGasCost);
    }

    function _extractTarget(bytes calldata callData) internal pure returns (address target) {
        require(callData.length >= 4 + 32, "Invalid calldata.");
        assembly {
            target := calldataload(add(callData.offset, 4))
        }
        target = address(uint160(target));
    }

    function setSponsoredContract(address target, bool sponsored) external onlyOwner {
        require(target != address(0), "Invalid address.");
        sponsoredContracts[target] = sponsored;
        emit SponsoredContractUpdated(target, sponsored);
    }

    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Value must be > 0.");
        entryPoint.depositTo{value: msg.value}(address(this));
        emit Deposited(msg.value);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address.");
        entryPoint.withdrawTo(to, amount);
        emit Withdrawn(to, amount);
    }

    function paymasterBalance() external view returns (uint256) {
        return entryPoint.balanceOf(address(this));
    }
}
