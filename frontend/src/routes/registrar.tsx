import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Check, Loader2, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { getRegistryContract, getMarketContract } from "@/lib/web3/config";

export const Route = createFileRoute("/registrar")({
  component: Registrar,
});

const produtores = [
  { id: "p0", name: "Meu Produtor (Teste)", farm: "Pindoretama, CE", wallet: "0xcf42E0D067e715A5f6fB6241645194c3C2876923" },
  { id: "p1", name: "Maria das Graças Silva", farm: "Pindoretama, CE", wallet: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" },
  { id: "p2", name: "João Batista Pereira",   farm: "Cascavel, CE",    wallet: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
  { id: "p3", name: "Francisca Lima",          farm: "Aquiraz, CE",     wallet: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" },
  { id: "p4", name: "Antônio Ferreira",        farm: "Pacajus, CE",     wallet: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" },
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
  const { account, signer, isConnecting, connectWallet } = useWeb3();
  const [produtor, setProdutor] = useState(produtores[0].id);
  const [peso, setPeso] = useState("0");
  const [produtoDestino, setProdutoDestino] = useState<ProdutoFinal>("fibra");
  const [stage, setStage] = useState<Stage>("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<number>(0);
  const [weightGrams, setWeightGrams] = useState<number>(0);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  const produtorSel = produtores.find(p => p.id === produtor)!;
  const preco = (Number(peso) || 0) * PRECOS[produtoDestino];

  // Busca o último lote entregue pelo produtor
  async function fetchLastBatch() {
    if (!signer) return;
    setIsLoadingBatch(true);
    setErrMsg(null);
    try {
      const registry = getRegistryContract(signer);
      const deliveries = await registry.getSupplierDeliveries(produtorSel.wallet);
      if (deliveries.length > 0) {
        const lastDeliveryId = deliveries[deliveries.length - 1];
        const delivery = await registry.deliveries(lastDeliveryId);
        setBatchId(Number(delivery.batchId));
        setWeightGrams(Number(delivery.weightGrams));
        setPeso((Number(delivery.weightGrams) / 1000).toString());
      } else {
        setBatchId(0);
        setPeso("0");
      }
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
    
    if (!account || !signer) {
      await connectWallet();
      return;
    }

    if (batchId === 0) {
      setErrMsg("Este produtor não tem nenhum lote pendente de coleta.");
      return;
    }

    setStage("bundling");
    
    try {
      const registry = getRegistryContract(signer);
      const market   = getMarketContract(signer);

      const isAdubo = produtoDestino === "po";
      
      // 1. Avança estágio no registro de ativos
      if (isAdubo) {
        const tx1 = await registry.finalizeBatchAsAdubo(batchId);
        await tx1.wait();
      } else {
        const tx1 = await registry.advanceBatchStage(batchId);
        await tx1.wait();
      }
      
      setStage("sponsored");
      
      // 2. Lista o produto no mercado
      const priceCents = Math.floor(PRECOS[produtoDestino] * 100);
      const tx2 = await market.list(batchId, weightGrams, priceCents, isAdubo);
      await tx2.wait();

      setStage("settled");
    } catch(err: any) {
      console.error(err);
      setErrMsg("Falha na transação. Tente novamente.");
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
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Brasil Eco Fibras · Compra de matéria-prima</div>
        <h1 className="font-display text-4xl md:text-5xl mb-10">
          Registrar compra de <span className="text-gradient-gold italic">casca de coco</span>
        </h1>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Form */}
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
                    <div className="font-mono text-xs text-gold/80 break-all w-24 sm:w-auto text-right">{p.wallet}</div>
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
              disabled={stage !== "idle" || batchId === 0 || isConnecting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? <><Loader2 className="size-4 animate-spin"/> Conectando...</> : 
               stage === "idle" ? (<>Confirmar Processamento <ArrowRight className="size-4" /></>) : 
               "Processando Smart Contracts…"}
            </button>
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Sem taxas adicionais · custo zero para o produtor
            </p>
          </form>

          {/* Status */}
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
                  <div className="font-mono text-xs text-muted-foreground mt-3">Comprovante #7C4F91A3</div>
                  <button onClick={reset} className="mt-4 text-xs font-medium text-gold hover:underline">
                    Registrar nova compra →
                  </button>
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
