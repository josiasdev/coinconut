const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const ENTRY_POINT_SEPOLIA   = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const INITIAL_PRICE_PER_KG  = 200; // R$ 2,00 por kg em centavos

  const CocoAsset = await ethers.getContractFactory("CocoAsset");
  const cocoAsset = await CocoAsset.deploy();
  await cocoAsset.waitForDeployment();
  console.log("CocoAsset:", await cocoAsset.getAddress());

  const PaymentLedger = await ethers.getContractFactory("PaymentLedger");
  const paymentLedger = await PaymentLedger.deploy();
  await paymentLedger.waitForDeployment();
  console.log("PaymentLedger:", await paymentLedger.getAddress());

  const SustainabilityNFT = await ethers.getContractFactory("SustainabilityNFT");
  const sustainabilityNFT = await SustainabilityNFT.deploy();
  await sustainabilityNFT.waitForDeployment();
  console.log("SustainabilityNFT:", await sustainabilityNFT.getAddress());

  const CoconutRegistry = await ethers.getContractFactory("CoconutRegistry");
  const registry = await CoconutRegistry.deploy(
    await cocoAsset.getAddress(),
    await paymentLedger.getAddress(),
    INITIAL_PRICE_PER_KG
  );
  await registry.waitForDeployment();
  console.log("CoconutRegistry:", await registry.getAddress());

  const BriquetteMarket = await ethers.getContractFactory("BriquetteMarket");
  const market = await BriquetteMarket.deploy(
    await sustainabilityNFT.getAddress(),
    await paymentLedger.getAddress()
  );
  await market.waitForDeployment();
  console.log("BriquetteMarket:", await market.getAddress());

  const CoinconutPaymaster = await ethers.getContractFactory("CoinconutPaymaster");
  const paymaster = await CoinconutPaymaster.deploy(
    ENTRY_POINT_SEPOLIA,
    await registry.getAddress(),
    await market.getAddress()
  );
  await paymaster.waitForDeployment();
  console.log("CoinconutPaymaster:", await paymaster.getAddress());

  const FACTORY_ROLE  = ethers.keccak256(ethers.toUtf8Bytes("FACTORY_ROLE"));
  const MINTER_ROLE   = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));

  await cocoAsset.grantRole(FACTORY_ROLE, await registry.getAddress());
  await cocoAsset.grantRole(FACTORY_ROLE, deployer.address);
  await paymentLedger.grantRole(OPERATOR_ROLE, await registry.getAddress());
  await paymentLedger.grantRole(OPERATOR_ROLE, await market.getAddress());
  await sustainabilityNFT.grantRole(MINTER_ROLE, await market.getAddress());
  await market.grantRole(FACTORY_ROLE, deployer.address);

  console.log("\nRoles configuradas.");
  console.log("\nAções manuais obrigatórias após o deploy:");
  console.log("  1. paymentLedger.grantRole(ORACLE_ROLE, 0x_ORACULO)");
  console.log("  2. market.grantRole(ORACLE_ROLE, 0x_ORACULO)");
  console.log("  3. registry.addCollectionPoint('Nome', 0x_WALLET)");
  console.log("  4. paymaster.deposit({ value: ethers.parseEther('0.1') })");
}

main().catch((e) => { console.error(e); process.exit(1); });
