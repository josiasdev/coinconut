import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Check, Loader2, Sparkles, ArrowRight, AlertCircle, ExternalLink, Award } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { CONTRACT_ADDRESSES, submitTransaction } from "@/lib/web3/config";
import * as StellarSdk from "@stellar/stellar-sdk";

export const Route = createFileRoute("/registrar")({
  component: Registrar,
});

const produtores = [
  { id: "p0", name: "Meu Produtor (Teste)", farm: "Pindoretama, CE", wallet: "GBQ4RZW2I5XMB35EHQK7LBY7CHOPW6E5WIVT2MOPQWHLHVKXV2J2A5W4" }
];

type Stage = "idle" | "bundling" | "sponsored" | "settled";
type ProdutoFinal = "fibra" | "po" | "chip" | "briquete";

const PRECOS: Record<ProdutoFinal, number> = {
  fibra: 3.20,
  po: 1.80,
  chip: 2.50,
  briquete: 2.40
};

const NOMES_PRODUTOS: Record<ProdutoFinal, string> = {
  fibra: "Fibra de Coco",
  po: "Pó / Substrato de Coco",
  chip: "Chip de Coco",
  briquete: "Briquete Ecológico"
};

function Registrar() {
  const { account, isConnecting, connectWallet } = useWeb3();
  const [produtor, setProdutor] = useState(produtores[0].id);
  const [peso, setPeso] = useState("0");
  const [produtoDestino, setProdutoDestino] = useState<ProdutoFinal>("fibra");
  const [stage, setStage] = useState<Stage>("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<number>(0);
  const [weightGrams, setWeightGrams] = useState<number>(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  const produtorSel = produtores.find(p => p.id === produtor)!;
  const preco = (Number(peso) || 0) * PRECOS[produtoDestino];

  async function fetchLastBatch() {
    setIsLoadingBatch(true);
    setErrMsg(null);
    try {
      // MOCK: Simula sincronização com a rede Stellar para buscar último lote
      await new Promise(resolve => setTimeout(resolve, 800));
      setBatchId(1);
      setWeightGrams(80000);
      setPeso("80");
    } catch (err: any) {
      console.error(err);
      setErrMsg("Erro ao buscar lote: " + err.message);
    } finally {
      setIsLoadingBatch(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    
    if (!account) {
      await connectWallet();
      return;
    }

    if (batchId === 0) {
      setErrMsg("Este produtor não tem nenhum lote pendente de coleta.");
      return;
    }

    setStage("bundling");
    const tId = toast.loading("Verificando dados...", { description: "Iniciando processo na blockchain Stellar" });
    
    try {
      const isAdubo = produtoDestino === "po";
      
      toast.loading("Avançando estágio do material...", { id: tId, description: "Assine a transação no Freighter" });
      
      const method = isAdubo ? "finalize_as_adubo" : "advance_stage";
      const tx1 = await submitTransaction(
        account,
        CONTRACT_ADDRESSES.CoinconutCore,
        method,
        [StellarSdk.nativeToScVal(batchId, { type: "u32" })]
      );
      
      setStage("sponsored");

      toast.loading("Simulando venda B2B e emitindo NFT...", { id: tId, description: "Aguarde a rede Stellar..." });
      
      const tx3 = await submitTransaction(
        account,
        CONTRACT_ADDRESSES.CoinconutCore,
        "issue_cert",
        [
          new StellarSdk.Address(account).toScVal(), // buyer is current user
          StellarSdk.nativeToScVal(batchId, { type: "u32" }),
          StellarSdk.nativeToScVal(weightGrams, { type: "u32" }),
          StellarSdk.nativeToScVal(`Selo ESG - ${NOMES_PRODUTOS[produtoDestino]}`, { type: "string" })
        ]
      );

      setTxHash(tx3.txHash);
      setStage("settled");
      toast.success("Selo ESG conquistado com sucesso!", { id: tId });
    } catch(err: any) {
      console.error(err);
      toast.error("Falha na transação.", { id: tId });
      const msg = err.message || "Erro desconhecido.";
      setErrMsg("Falha na transação: " + msg);
      setStage("idle");
    }
  }

  function reset() {
    setStage("idle");
    setPeso("0");
    setBatchId(0);
    setErrMsg(null);
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Brasil Eco Fibras · Compra de matéria-prima</div>
            <h1 className="font-display text-4xl md:text-5xl">
              Registrar compra de <span className="text-gradient-gold italic">casca de coco</span>
            </h1>
          </div>
          <Link to="/esg" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gold/30 bg-gold/5 text-gold hover:bg-gold/15 transition text-sm font-medium whitespace-nowrap">
            <Award className="size-4" />
            Galeria ESG
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <form onSubmit={submit} className="glass-card rounded-2xl p-7 space-y-6">
            {errMsg && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <div className="text-sm font-medium">{errMsg}</div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Produtor</label>
              <button type="button" onClick={fetchLastBatch} className="text-xs text-gold hover:underline flex items-center gap-1">
                {isLoadingBatch ? <Loader2 className="size-3 animate-spin"/> : "Sincronizar rede"}
              </button>
            </div>
            <div className="space-y-2">
                {produtores.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProdutor(p.id);
                      setBatchId(0);
                      setPeso("0");
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                      produtor === p.id ? "border-gold/60 bg-gold/5" : "border-border hover:border-border/80 bg-secondary/30"
                    }`}
                  >
                    <div>
                      <div className="text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{p.farm}</div>
                    </div>
                    <div className="font-mono text-xs text-gold/80 break-all w-24 sm:w-auto text-right">
                      {p.wallet.slice(0,6)}...{p.wallet.slice(-4)}
                    </div>
                  </button>
                ))}
              </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Lote a ser processado (Peso em kg)</label>
              {batchId > 0 ? (
                <div className="mt-3 w-full bg-accent/10 border border-accent/20 rounded-xl px-4 py-3.5 font-display text-2xl text-foreground flex justify-between items-center">
                  <span>{peso} <span className="text-sm font-sans text-muted-foreground ml-1">kg</span></span>
                  <span className="text-xs font-mono text-accent bg-accent/20 px-2 py-1 rounded">Lote #{batchId}</span>
                </div>
              ) : (
                <div className="mt-3 w-full bg-secondary/40 border border-border rounded-xl px-4 py-3.5 text-sm text-muted-foreground italic text-center">
                  Sincronize ou selecione um produtor com entregas pendentes.
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-3">Produto a ser gerado</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PRECOS) as ProdutoFinal[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setProdutoDestino(key)}
                    className={`p-3 rounded-xl border text-left transition ${
                      produtoDestino === key
                        ? "border-gold/60 bg-gold/5"
                        : "border-border hover:border-border/80 bg-secondary/30"
                    }`}
                  >
                    <div className="text-sm font-medium">{NOMES_PRODUTOS[key]}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">R$ {PRECOS[key].toFixed(2)} / kg</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/60">
              <span className="text-sm text-muted-foreground">Liquidação estimada</span>
              <span className="font-display text-2xl text-gradient-gold">
                R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              type="submit"
              disabled={stage !== "idle" || batchId === 0 || isConnecting || !account}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? <><Loader2 className="size-4 animate-spin"/> Conectando...</> : 
               !account ? "Conectar Carteira" :
               stage === "idle" ? (<>Confirmar Processamento <ArrowRight className="size-4" /></>) : 
               "Processando Smart Contracts…"}
            </button>
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Sem taxas adicionais · custo zero para o produtor
            </p>
          </form>

          <div className="glass-card rounded-2xl p-7">
            <h2 className="font-display text-xl mb-6">Status da operação</h2>
            <div className="space-y-4">
              <Step done={stage !== "idle"} active={stage === "bundling"} label="Verificando dados" sub="Conferindo peso e identificação" />
              <Step done={stage === "sponsored" || stage === "settled"} active={stage === "sponsored"} label="Autorizando transação" sub="Sem custo adicional para o produtor" />
              <Step done={stage === "settled"} active={false} label="Pagamento registrado" sub="Produtor notificado automaticamente" />
            </div>

            <AnimatePresence>
              {stage === "settled" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-accent/15 to-gold/10 border border-accent/30"
                >
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="size-4" />
                    <span className="text-xs font-mono uppercase tracking-widest">Sucesso</span>
                  </div>
                  <div className="mt-2 text-sm">
                    Compra registrada com sucesso. O pagamento será enviado
                    automaticamente para a conta do produtor.
                  </div>
                  {txHash && (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs mt-3 text-accent hover:underline font-mono bg-secondary/50 px-3 py-1.5 rounded-lg border border-border"
                    >
                      <ExternalLink className="size-3" />
                      Ver no Stellar Expert
                    </a>
                  )}
                  <div className="block mt-4">
                    <button onClick={reset} className="text-xs font-medium text-gold hover:underline">
                      Registrar nova compra →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Step({ done, active, label, sub }: { done: boolean; active: boolean; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-0.5 size-8 rounded-full grid place-items-center shrink-0 border transition ${
        done ? "bg-accent/20 border-accent text-accent" : active ? "bg-gold/10 border-gold/60 text-gold" : "bg-secondary/40 border-border text-muted-foreground"
      }`}>
        {done ? <Check className="size-4" /> : active ? <Loader2 className="size-4 animate-spin" /> : <span className="size-1.5 rounded-full bg-current" />}
      </div>
      <div className="flex-1 pt-1">
        <div className={`text-sm ${done || active ? "text-foreground" : "text-muted-foreground"}`}>{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
