const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const nft = await ethers.getContractAt("SustainabilityNFT", "0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619");
  
  console.log("Testing issue...");
  try {
    const tx = await nft.issue(deployer.address, 1, 1000, "Selo ESG - Fibra de Coco");
    await tx.wait();
    console.log("Minted successfully!");
  } catch (e) {
    console.error("Failed to mint:", e);
  }
}
main().catch(console.error);
