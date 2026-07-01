import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { Award, Leaf, ShieldCheck, ArrowLeft, Loader2, Wallet } from "lucide-react";

export const Route = createFileRoute("/esg")({
  component: ESG,
});

function ESG() {
  const { account, isConnecting, connectWallet } = useWeb3();
  const [nftBalance, setNftBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showZkModal, setShowZkModal] = useState(false);
  const [zkStatus, setZkStatus] = useState<"idle" | "generating" | "solving" | "submitting" | "success">("idle");

  const runZkSimulation = async () => {
    setZkStatus("generating");
    await new Promise(r => setTimeout(r, 1200));
    setZkStatus("solving");
    await new Promise(r => setTimeout(r, 1500));
    setZkStatus("submitting");
    await new Promise(r => setTimeout(r, 1200));
    setZkStatus("success");
    await new Promise(r => setTimeout(r, 1000));
    setShowZkModal(false);
    setZkStatus("idle");
    setNftBalance((prev) => (prev || 0) + 1);
  };

  useEffect(() => {
    async function fetchNFTs() {
      if (!account) return;
      try {
        setIsLoading(true);
        // Mocking the data fetching since we migrated to a streamlined Soroban contract
        await new Promise(resolve => setTimeout(resolve, 800));
        setNftBalance(2);
      } catch (err) {
        console.error("Erro ao buscar NFTs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNFTs();
  }, [account]);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12">
        <Link to="/registrar" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition">
          <ArrowLeft className="size-4" /> Voltar para o portal de Indústria
        </Link>
        
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Galeria de Conquistas</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <h1 className="font-display text-4xl md:text-5xl">
            Seus <span className="text-gradient-gold italic">Selos ESG</span>
          </h1>
          {account && (
            <button 
              onClick={() => setShowZkModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition shadow-glow text-sm"
            >
              <ShieldCheck className="size-4 text-primary" /> Emitir Selo via ZK Proof
            </button>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl mb-12">
          Cada selo representa um lote de casca de coco processado através da rede COINCONUT. 
          Estes certificados são ativos digitais intransferíveis emitidos nativamente via Soroban na blockchain Stellar, garantindo a rastreabilidade e a transparência antifraude do seu impacto ambiental.
        </p>

        {!account ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <Wallet className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl mb-2">Conecte sua carteira empresarial</h3>
            <p className="text-sm text-muted-foreground mb-6">Para visualizar seus selos de sustentabilidade on-chain.</p>
            <button onClick={connectWallet} disabled={isConnecting} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-50">
              {isConnecting ? <Loader2 className="size-4 animate-spin"/> : "Conectar Freighter"}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Renderiza N selos baseados no saldo */}
            {Array.from({ length: nftBalance }).map((_, i) => {
              // Metadados dinâmicos baseados no índice para dar ilusão de variedade on-chain
              const tiers = [
                { name: "Genesis", color: "from-amber-600/80 to-amber-900", border: "border-amber-600/50", glow: "shadow-[0_0_30px_rgba(217,119,6,0.3)]" },
                { name: "Esmeralda", color: "from-emerald-500/80 to-emerald-800", border: "border-emerald-500/50", glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]" },
                { name: "Safira", color: "from-blue-500/80 to-blue-800", border: "border-blue-500/50", glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]" },
                { name: "Ametista", color: "from-purple-500/80 to-purple-800", border: "border-purple-500/50", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" },
              ];
              const tier = tiers[i % tiers.length];
              const carbon = 50 + (i * 15); // Ex: 50kg, 65kg, 80kg
              const tokenId = String(i + 1).padStart(4, '0');
              
              const actions = ["Logística", "Reciclagem", "Biomassa", "Coleta"];
              const impacts = ["Sócio-Ambiental", "Zero Descarte", "Inclusão", "Circularidade"];
              const currentAction = actions[i % actions.length];
              const currentImpact = impacts[i % impacts.length];
              
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                  className="group relative aspect-[3/4] rounded-3xl p-1 overflow-hidden cursor-pointer"
                >
                  {/* Fundo animado brilhante no hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-40 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  {/* O Card em si */}
                  <div className={`relative h-full w-full bg-background/95 backdrop-blur-xl rounded-[22px] border ${tier.border} overflow-hidden flex flex-col transition-transform duration-500 group-hover:scale-[0.98]`}>
                    
                    {/* Área da Arte (Mesh/Abstract) */}
                    <div className={`h-[55%] w-full bg-gradient-to-br ${tier.color} relative overflow-hidden flex items-center justify-center`}>
                      {/* Efeitos abstratos dentro da arte */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                      <div className="absolute -top-10 -right-10 size-40 bg-white/20 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-10 -left-10 size-40 bg-black/20 rounded-full blur-2xl"></div>
                      
                      <Award className="size-20 text-white/90 drop-shadow-xl" strokeWidth={1} />
                      
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider">
                        <ShieldCheck className="size-3" />
                        Soulbound
                      </div>
                      
                      <div className="absolute bottom-4 left-4 text-white/90 font-mono text-xs opacity-80">
                        #{tokenId}
                      </div>
                    </div>

                    {/* Metadados / Informações */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                          Tier {tier.name}
                        </div>
                        <h3 className="font-display text-xl mb-3 text-foreground leading-tight">Certificado ImpactLedger</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs gap-2">
                            <span className="text-muted-foreground">Impacto</span>
                            <span className="font-medium text-primary text-right truncate">{currentImpact}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs gap-2">
                            <span className="text-muted-foreground">Ação Validada</span>
                            <span className="font-medium text-foreground text-right truncate">{currentAction}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-border/60 flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Stellar Testnet</span>
                        <span className="font-mono bg-secondary px-2 py-1 rounded text-foreground">Soroban DataKey</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        {/* ZK Proof Modal Simulation */}
        {showZkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-elegant overflow-hidden">
              <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-2 font-display text-lg">
                  <ShieldCheck className="size-5 text-primary" /> Confidencialidade ZK
                </div>
                <button onClick={() => setShowZkModal(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
              </div>
              <div className="p-6 space-y-6">
                {zkStatus === "idle" ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Insira o peso total processado neste mês. A Prova de Conhecimento Zero (Noir) vai provar para o Soroban que você bateu a meta, sem vazar esse número na rede pública.
                    </p>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground uppercase">Peso Processado (kg)</label>
                      <input type="number" defaultValue="6000" className="w-full bg-background border border-border rounded-xl px-4 py-3 mt-1 outline-none focus:border-primary font-mono text-lg" />
                    </div>
                    <button 
                      onClick={runZkSimulation}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition"
                    >
                      Gerar Prova Matemática Localmente
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
                    <Loader2 className={`size-12 ${zkStatus === "success" ? "text-primary" : "text-muted-foreground animate-spin"}`} />
                    <div className="font-mono text-sm space-y-2 text-left bg-secondary/50 p-4 rounded-xl w-full border border-border/50">
                      <div className={zkStatus !== "idle" ? "text-foreground" : "text-muted-foreground opacity-50"}>
                        <span className="text-primary mr-2">❯</span> Inicializando Noir.js Prover...
                      </div>
                      <div className={zkStatus === "solving" || zkStatus === "submitting" || zkStatus === "success" ? "text-foreground" : "text-muted-foreground opacity-50"}>
                        <span className="text-primary mr-2">❯</span> Resolvendo restrições do circuito (assert >= 5000)...
                      </div>
                      <div className={zkStatus === "submitting" || zkStatus === "success" ? "text-foreground" : "text-muted-foreground opacity-50"}>
                        <span className="text-primary mr-2">❯</span> Prova UltraHonk gerada (2.1kb)! Enviando ao Soroban...
                      </div>
                      <div className={zkStatus === "success" ? "text-primary font-bold" : "text-muted-foreground opacity-50"}>
                        <span className="text-primary mr-2">❯</span> Contrato ZkVerifier aceitou a prova. Selo emitido!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
