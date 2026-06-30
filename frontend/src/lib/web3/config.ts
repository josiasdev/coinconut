import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

export const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

export const CONTRACT_ADDRESSES = {
  CoinconutCore: import.meta.env.VITE_COINCONUT_CORE_ADDRESS || "CCIJZTJJBPU3CHI3235FR7SY22F5IOYQJOV3WAYNB3OY3MQ7TOI4AA3P",
};

export const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL, { allowHttp: true });

// Helper to simulate, sign with freighter, and submit
export async function submitTransaction(
  publicKey: string,
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[],
  sponsorKey?: string // For Fee Bump
) {
  try {
    const account = await server.getAccount(publicKey);
    
    const contract = new StellarSdk.Contract(contractId);
    let tx = new StellarSdk.TransactionBuilder(account, { fee: "100", networkPassphrase: NETWORK_PASSPHRASE })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    // Prepare transaction (simulates and adds necessary footprint)
    const preparedTx = await server.prepareTransaction(tx);
    
    // Sign with Freighter
    const signedTxResponse = await signTransaction(preparedTx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    
    if (signedTxResponse.error) {
      throw new Error("User declined the request or there was an error signing: " + (signedTxResponse.error as any).message || String(signedTxResponse.error));
    }
    
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxResponse.signedTxXdr, NETWORK_PASSPHRASE);
    
    // Check if we need Fee Bump
    if (sponsorKey) {
      // Logic for fee bump would go here (requires backend or sponsor signing service)
      // Usually the sponsor signs a FeeBumpTransaction over the signed inner transaction.
      // For the frontend, we could send it to a backend endpoint.
      // E.g., const feeBumpTx = new StellarSdk.FeeBumpTransaction(sponsorAccount, innerTx.toEnvelopeXdr().toString("base64"), baseFee);
    }

    // Submit
    const response = await server.sendTransaction(signedTx);
    
    if (response.status !== "PENDING") {
      throw new Error(`Failed to submit transaction: ${response.status}`);
    }

    // Wait for inclusion
    let txResult = await server.getTransaction(response.hash);
    while (txResult.status === "NOT_FOUND") {
      await new Promise(resolve => setTimeout(resolve, 2000));
      txResult = await server.getTransaction(response.hash);
    }
    
    if (txResult.status === "SUCCESS") {
      return { txHash: response.hash, result: txResult.resultMetaXdr };
    } else {
      throw new Error(`Transaction failed in ledger`);
    }

  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
}
