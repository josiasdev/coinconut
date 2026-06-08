const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Saldo atual (ETH):", ethers.formatEther(balance));
}
main().catch((e) => { console.error(e); process.exit(1); });
