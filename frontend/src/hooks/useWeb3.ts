import { useState, useEffect, useCallback } from "react";
import { isConnected, getAddress, requestAccess } from "@stellar/freighter-api";
import { toast } from "sonner";

export function useWeb3() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectedInfo = await isConnected();
        if (connectedInfo.isConnected) {
          const { address } = await getAddress();
          if (address) {
            setAccount(address);
          }
        }
      } catch (err) {
        console.error("Erro ao verificar conexão Stellar:", err);
      }
    };
    
    checkConnection();
  }, []);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connectedInfo = await isConnected();
      if (!connectedInfo.isConnected) {
        toast.error("Freighter Wallet não detectada. Instale a extensão do Freighter.");
        window.open("https://freighter.app/", "_blank");
        setIsConnecting(false);
        return;
      }

      const accessInfo = await requestAccess();
      if (accessInfo.error) {
         setError("Acesso negado.");
         toast.error("Conexão com Freighter rejeitada.");
      } else {
         const { address } = await getAddress();
         if (address) {
            setAccount(address);
         } else {
            setError("Endereço não encontrado.");
         }
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao conectar carteira Stellar");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  return { account, isConnecting, error, connectWallet };
}
