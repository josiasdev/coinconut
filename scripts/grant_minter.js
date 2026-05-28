const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const nft = await ethers.getContractAt("SustainabilityNFT", "0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619");
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  console.log("Granting MINTER_ROLE to", deployer.address);
  const tx = await nft.grantRole(MINTER_ROLE, deployer.address);
  await tx.wait();
  console.log("Granted!");
}
main().catch(console.error);
