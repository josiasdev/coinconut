import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider if MetaMask is present
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(browserProvider);

      // Check if already connected
      browserProvider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          browserProvider.getSigner().then(setSigner);
        }
      });

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          browserProvider.getSigner().then(setSigner);
        } else {
          setAccount(null);
          setSigner(null);
        }
      };

      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        if ((window as any).ethereum.removeListener) {
          (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!provider) {
      setError("MetaMask não encontrado. Instale a extensão para continuar.");
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      await provider.send("eth_requestAccounts", []);
      const newSigner = await provider.getSigner();
      const address = await newSigner.getAddress();
      setSigner(newSigner);
      setAccount(address);
    } catch (err: any) {
      setError(err.message || "Erro ao conectar carteira.");
    } finally {
      setIsConnecting(false);
    }
  }, [provider]);

  return {
    provider,
    signer,
    account,
    isConnecting,
    error,
    connectWallet,
  };
}
