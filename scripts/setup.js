/**
 * Script de setup e verificação pós-deploy.
 * Re-concede todas as roles necessárias e cadastra pontos de coleta.
 *
 * Uso:
 *   npx hardhat run scripts/setup.js --network sepolia
 */
const { ethers } = require("hardhat");

const COCO_ASSET_ADDRESS      = "0x961379292204ED01DC6436dC2db666f5E9532bCb";
const REGISTRY_ADDRESS        = "0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70";
const PAYMENT_LEDGER_ADDRESS  = "0x80d9A97CEE8F8530888879d09fc1010082aFEd64";
const MARKET_ADDRESS          = "0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e";
const SUSTAINABILITY_NFT_ADDRESS = "0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619";
const PAYMASTER_ADDRESS       = "0x09111165AC75767E23926bfAA56C884bCD1172bA";

// No MVP, o próprio deployer faz o papel de oráculo e operador
const DEPLOYER_ADDRESS = "0xcf42E0D067e715A5f6fB6241645194c3C2876923";

const COLLECTION_POINTS = [
  { name: "Pindoretama — Ponto Principal", wallet: DEPLOYER_ADDRESS },
  { name: "Cascavel — Associação CE",      wallet: DEPLOYER_ADDRESS },
  { name: "Aquiraz — Ponto Leste",         wallet: DEPLOYER_ADDRESS },
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Setup executado por:", deployer.address);

  const cocoAsset      = await ethers.getContractAt("CocoAsset",        COCO_ASSET_ADDRESS);
  const registry       = await ethers.getContractAt("CoconutRegistry",  REGISTRY_ADDRESS);
  const paymentLedger  = await ethers.getContractAt("PaymentLedger",    PAYMENT_LEDGER_ADDRESS);
  const market         = await ethers.getContractAt("BriquetteMarket",  MARKET_ADDRESS);
  const nft            = await ethers.getContractAt("SustainabilityNFT",SUSTAINABILITY_NFT_ADDRESS);
  const paymaster      = await ethers.getContractAt("CoinconutPaymaster", PAYMASTER_ADDRESS);

  const FACTORY_ROLE  = ethers.keccak256(ethers.toUtf8Bytes("FACTORY_ROLE"));
  const MINTER_ROLE   = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));
  const ORACLE_ROLE   = ethers.keccak256(ethers.toUtf8Bytes("ORACLE_ROLE"));

  console.log("\n--- [1/4] Concedendo roles no CocoAsset ---");
  // Registry precisa de FACTORY_ROLE para chamar createBatch/advanceStage
  if (!(await cocoAsset.hasRole(FACTORY_ROLE, REGISTRY_ADDRESS))) {
    const tx = await cocoAsset.grantRole(FACTORY_ROLE, REGISTRY_ADDRESS);
    await tx.wait();
    console.log("  ✓ FACTORY_ROLE → Registry");
  } else {
    console.log("  · Registry já tem FACTORY_ROLE");
  }

  console.log("\n--- [2/4] Concedendo roles no PaymentLedger ---");
  if (!(await paymentLedger.hasRole(OPERATOR_ROLE, REGISTRY_ADDRESS))) {
    const tx = await paymentLedger.grantRole(OPERATOR_ROLE, REGISTRY_ADDRESS);
    await tx.wait();
    console.log("  ✓ OPERATOR_ROLE → Registry");
  } else {
    console.log("  · Registry já tem OPERATOR_ROLE");
  }
  if (!(await paymentLedger.hasRole(OPERATOR_ROLE, MARKET_ADDRESS))) {
    const tx = await paymentLedger.grantRole(OPERATOR_ROLE, MARKET_ADDRESS);
    await tx.wait();
    console.log("  ✓ OPERATOR_ROLE → Market");
  } else {
    console.log("  · Market já tem OPERATOR_ROLE");
  }
  // Oráculo MVP = deployer
  if (!(await paymentLedger.hasRole(ORACLE_ROLE, DEPLOYER_ADDRESS))) {
    const tx = await paymentLedger.grantRole(ORACLE_ROLE, DEPLOYER_ADDRESS);
    await tx.wait();
    console.log("  ✓ ORACLE_ROLE → Deployer (MVP oracle)");
  } else {
    console.log("  · Deployer já tem ORACLE_ROLE no Ledger");
  }

  console.log("\n--- [3/4] Concedendo roles no BriquetteMarket / NFT ---");
  if (!(await nft.hasRole(MINTER_ROLE, MARKET_ADDRESS))) {
    const tx = await nft.grantRole(MINTER_ROLE, MARKET_ADDRESS);
    await tx.wait();
    console.log("  ✓ MINTER_ROLE → Market");
  } else {
    console.log("  · Market já tem MINTER_ROLE");
  }
  if (!(await market.hasRole(ORACLE_ROLE, DEPLOYER_ADDRESS))) {
    const tx = await market.grantRole(ORACLE_ROLE, DEPLOYER_ADDRESS);
    await tx.wait();
    console.log("  ✓ ORACLE_ROLE → Deployer (MVP oracle) no Market");
  } else {
    console.log("  · Deployer já tem ORACLE_ROLE no Market");
  }

  // Autorizar deployer como operador no Registry (permite chamar registerDelivery)
  const isOperator = await registry.authorizedOperators(DEPLOYER_ADDRESS);
  if (!isOperator) {
    const tx = await registry.setOperator(DEPLOYER_ADDRESS, true);
    await tx.wait();
    console.log("  ✓ Deployer adicionado como operador no Registry");
  } else {
    console.log("  · Deployer já é operador no Registry");
  }

  console.log("\n--- [4/4] Cadastrando Pontos de Coleta ---");
  const cpCount = Number(await registry.collectionPointCount());
  if (cpCount >= COLLECTION_POINTS.length) {
    console.log(`  · ${cpCount} pontos já cadastrados. Pulando.`);
  } else {
    for (let i = cpCount; i < COLLECTION_POINTS.length; i++) {
      const cp = COLLECTION_POINTS[i];
      const tx = await registry.addCollectionPoint(cp.name, cp.wallet);
      await tx.wait();
      console.log(`  ✓ Ponto #${i + 1} cadastrado: "${cp.name}"`);
    }
  }

  console.log("\n--- [5/5] Depositando ETH no Paymaster ---");
  const depositInfo = await paymaster.paymasterBalance();
  if (depositInfo < ethers.parseEther("0.001")) {
    const tx = await paymaster.deposit({ value: ethers.parseEther("0.001") });
    await tx.wait();
    console.log("  ✓ 0.001 ETH depositado no Paymaster!");
  } else {
    console.log("  · Paymaster já possui fundos suficientes.");
  }

  console.log("\n✅ Setup concluído com sucesso!");
  console.log("   Pontos de coleta IDs: 1, 2, 3");
  console.log("   Agora você pode registrar entregas na tela /coleta");
}

main().catch((e) => { console.error(e); process.exit(1); });
