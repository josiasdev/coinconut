const { ethers } = require("hardhat");
async function main() {
  const registry = await ethers.getContractAt("CoconutRegistry", "0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70");
  const count = await registry.collectionPointCount();
  console.log("Total CPs:", count.toString());
  for (let i = 1; i <= count; i++) {
    const cp = await registry.collectionPoints(i);
    console.log(`CP ${i}: ${cp.name} | ${cp.wallet} | active: ${cp.active}`);
  }
}
main().catch(console.error);
