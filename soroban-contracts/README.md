# COINCONUT Soroban Smart Contract

This directory contains the central smart contract for the **COINCONUT** platform, built using Rust and the **Soroban SDK**.

## Project Structure

```text
.
├── contracts
│   └── coinconut          # Main Logic Contract
│       ├── src
│       │   ├── lib.rs     # Smart Contract Logic (Batch & ZK Certificates)
│       │   └── test.rs    # Unit Tests
│       ├── Cargo.toml     # Rust Dependencies
│       └── Makefile       # Build scripts
├── Cargo.toml
├── DEPLOYMENT.md          # Contract IDs and Interfaces
└── README.md
```

## Features
- **Supply Chain Traceability**: Immutable logs of coconut husk batches from origin to final transformation.
- **ESG Certificates**: Issuance of Soulbound tokens attesting to the sustainable impact of industries.
- **Zero-Knowledge Privacy (`issue_cert_zk`)**: Verification of off-chain Noir (ZK-SNARK) proofs via `UltraHonk` primitives to issue ESG certificates without revealing sensitive industrial processing volumes to the public network.

## How to Build and Test

Navigate to the contract directory:
```bash
cd contracts/coinconut
```

Run unit tests (Includes ZK failure and success mocking):
```bash
make test
```

Compile the contract to WASM:
```bash
make build
```
