import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { getNftContract } from "@/lib/web3/config";
import { Award, Leaf, ShieldCheck, ArrowLeft, Loader2, Wallet } from "lucide-react";

export const Route = createFileRoute("/esg")({
  component: ESG,
});

function ESG() {
  const { account, signer, isConnecting, connectWallet } = useWeb3();
  const [nftBalance, setNftBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchNFTs() {
      if (!signer || !account) return;
      try {
        setIsLoading(true);
        const nft = getNftContract(signer);
        const balance = await nft.balanceOf(account);
        setNftBalance(Number(balance));
      } catch (err) {
        console.error("Erro ao buscar NFTs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNFTs();
  }, [signer, account]);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12">
        <Link to="/registrar" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition">
          <ArrowLeft className="size-4" /> Voltar para o portal de Indústria
        </Link>
        
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Galeria de Conquistas</div>
        <h1 className="font-display text-4xl md:text-5xl mb-4">
          Seus <span className="text-gradient-gold italic">Selos ESG</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mb-12">
          Cada selo representa um lote de casca de coco processado através da rede COINCONUT. 
          Estes certificados são NFTs (Soulbound Tokens) intransferíveis, emitidos na blockchain Sepolia, garantindo a rastreabilidade e a transparência do seu impacto ambiental.
        </p>

        {!account ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <Wallet className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl mb-2">Conecte sua carteira empresarial</h3>
            <p className="text-sm text-muted-foreground mb-6">Para visualizar seus selos de sustentabilidade on-chain.</p>
            <button onClick={connectWallet} disabled={isConnecting} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-50">
              {isConnecting ? <Loader2 className="size-4 animate-spin"/> : "Conectar MetaMask"}
            </button>
          </div>
        ) : isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="size-8 animate-spin mb-4 text-gold" />
            <span>Consultando a blockchain...</span>
          </div>
        ) : nftBalance === null || nftBalance === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto border-dashed border-2">
            <div className="size-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Leaf className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-display text-xl mb-2">Nenhum selo conquistado ainda</h3>
            <p className="text-sm text-muted-foreground">Registre sua primeira compra de matéria-prima para receber seu certificado ESG imutável.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Renderiza N selos baseados no saldo */}
            {Array.from({ length: nftBalance }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-1 relative overflow-hidden group"
              >
                {/* Glow de fundo */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="bg-background rounded-[22px] p-6 h-full border border-gold/10 relative z-10 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-gold/20 to-coconut border border-gold/30 grid place-items-center shadow-[0_0_15px_rgba(255,225,117,0.2)]">
                      <Award className="size-6 text-gold" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-wider">
                      <ShieldCheck className="size-3" />
                      Soulbound
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display text-2xl mb-2 text-gradient-gold">Certificado ESG</h3>
                    <p className="text-sm text-muted-foreground">Transformação de casca de coco em bioproduto.</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Rede Sepolia</span>
                      <span className="font-mono">ERC-721</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
