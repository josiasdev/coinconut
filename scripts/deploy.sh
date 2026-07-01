#!/bin/bash
# Script de Deploy do Smart Contract COINCONUT na rede Stellar Testnet

echo "🥥 Compilando o contrato Soroban..."
cd soroban-contracts/contracts/coinconut
make build

echo "🚀 Fazendo o deploy na Stellar Testnet..."
stellar contract deploy \
  --wasm ../../target/wasm32v1-none/release/coinconut.wasm \
  --source default \
  --network testnet

echo "✅ Deploy concluído! Atualize o Contract ID no DEPLOYMENT.md se necessário."
