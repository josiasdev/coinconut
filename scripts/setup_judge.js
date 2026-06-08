const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // 1. Create a new random wallet for the judge
  const judgeWallet = ethers.Wallet.createRandom().connect(ethers.provider);
  console.log("====================================");
  console.log("JURY WALLET CREATED!");
  console.log("Address:", judgeWallet.address);
  console.log("Private Key:", judgeWallet.privateKey);
  console.log("====================================");

  // 2. Fund the wallet with 0.02 ETH
  console.log("Funding wallet with 0.02 Sepolia ETH...");
  const txFund = await deployer.sendTransaction({
    to: judgeWallet.address,
    value: ethers.parseEther("0.02")
  });
  await txFund.wait();
  console.log("Funded!");

  // 3. Grant Roles
  const registry = await ethers.getContractAt("CoconutRegistry", "0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70");
  const nft = await ethers.getContractAt("SustainabilityNFT", "0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619");
  
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

  console.log("Granting Operator status on Registry...");
  const txOp = await registry.setOperator(judgeWallet.address, true);
  await txOp.wait();
  
  console.log("Adding as a Collection Point...");
  const txCp = await registry.addCollectionPoint("Ponto dos Jurados (Banca)", judgeWallet.address);
  await txCp.wait();

  console.log("Granting MINTER_ROLE on SustainabilityNFT...");
  const txMint = await nft.grantRole(MINTER_ROLE, judgeWallet.address);
  await txMint.wait();

  console.log("Setup complete! The judge can now use the full DApp.");
}

main().catch(console.error);
