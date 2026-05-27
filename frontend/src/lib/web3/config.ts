import { ethers } from "ethers";
import { CoconutRegistryABI, BriquetteMarketABI, PaymentLedgerABI } from "./abis";

export const CONTRACT_ADDRESSES = {
  Registry: import.meta.env.VITE_REGISTRY_ADDRESS,
  Market: import.meta.env.VITE_MARKET_ADDRESS,
  CocoAsset: import.meta.env.VITE_COCO_ASSET_ADDRESS,
  PaymentLedger: import.meta.env.VITE_PAYMENT_LEDGER_ADDRESS,
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
