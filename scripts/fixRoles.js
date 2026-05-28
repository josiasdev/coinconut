const { ethers } = require("hardhat");

async function main() {
  const MARKET_ADDRESS = "0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e";
  const DEPLOYER_ADDRESS = "0xcf42E0D067e715A5f6fB6241645194c3C2876923";
  const FACTORY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("FACTORY_ROLE"));

  const market = await ethers.getContractAt("BriquetteMarket", MARKET_ADDRESS);
  const tx = await market.grantRole(FACTORY_ROLE, DEPLOYER_ADDRESS);
  await tx.wait();
  console.log("FACTORY_ROLE granted to Deployer on BriquetteMarket!");
}
main().catch((e) => { console.error(e); process.exit(1); });
