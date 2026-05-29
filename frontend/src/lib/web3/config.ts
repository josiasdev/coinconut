import { ethers } from "ethers";
import { CoconutRegistryABI, BriquetteMarketABI, PaymentLedgerABI, SustainabilityNFTABI } from "./abis";

export const CONTRACT_ADDRESSES = {
  Registry: import.meta.env.VITE_REGISTRY_ADDRESS || "0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70",
  Market: import.meta.env.VITE_MARKET_ADDRESS || "0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e",
  CocoAsset: import.meta.env.VITE_COCO_ASSET_ADDRESS || "0x961379292204ED01DC6436dC2db666f5E9532bCb",
  PaymentLedger: import.meta.env.VITE_PAYMENT_LEDGER_ADDRESS || "0x80d9A97CEE8F8530888879d09fc1010082aFEd64",
  SustainabilityNFT: import.meta.env.VITE_SUSTAINABILITY_NFT_ADDRESS || "0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619",
};

export function getRegistryContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESSES.Registry, CoconutRegistryABI, signerOrProvider);
}

export function getMarketContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESSES.Market, BriquetteMarketABI, signerOrProvider);
}

export function getPaymentLedgerContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESSES.PaymentLedger, PaymentLedgerABI, signerOrProvider);
}

export function getNftContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESSES.SustainabilityNFT, SustainabilityNFTABI, signerOrProvider);
}
