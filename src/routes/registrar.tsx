import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/registrar")({
  head: () => ({
    meta: [
      { title: "Registrar compra — COINCONUT" },
      { name: "description", content: "UC01 — Fábrica registra compra de matéria-prima do produtor. Transferência atômica via ERC-1155 com gas patrocinado." },
    ],
  }),
  component: Registrar,
});

const produtores = [
  { id: "p1", name: "Maria Silva", farm: "Sítio Bom Coco · CE", wallet: "0x71a…c4f2" },
  { id: "p2", name: "João Pereira", farm: "Coqueiral do Norte · BA", wallet: "0x9d4…0aa8" },
  { id: "p3", name: "Coop. Verde Litoral", farm: "Cooperativa · PB", wallet: "0xfe1…32b9" },
];

type Stage = "idle" | "bundling" | "sponsored" | "settled";

function Registrar() {
  const [produtor, setProdutor] = useState(produtores[0].id);
  const [peso, setPeso] = useState("1000");
  const [stage, setStage] = useState<Stage>("idle");

  const preco = (Number(peso) || 0) * 2.4;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStage("bundling");
    await new Promise((r) => setTimeout(r, 1100));
    setStage("sponsored");
    await new Promise((r) => setTimeout(r, 1100));
    setStage("settled");
  }

  function reset() {
    setStage("idle");
    setPeso("1000");
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">UC01 · Compra de matéria-prima</div>
        <h1 className="font-display text-4xl md:text-5xl mb-10">
          Registrar compra de <span className="text-gradient-gold italic">casca de coco</span>
        </h1>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Form */}
          <form onSubmit={submit} className="glass-card rounded-2xl p-7 space-y-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Produtor</label>
              <div className="mt-3 space-y-2">
                {produtores.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProdutor(p.id)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                      produtor === p.id ? "border-gold/60 bg-gold/5" : "border-border hover:border-border/80 bg-secondary/30"
                    }`}
                  >
                    <div>
                      <div className="text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{p.farm}</div>
                    </div>
                    <div className="font-mono text-xs text-gold/80">{p.wallet}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Peso entregue (kg)</label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                min={1}
                className="mt-3 w-full bg-secondary/40 border border-border rounded-xl px-4 py-3.5 font-display text-2xl focus:outline-none focus:border-gold/60 transition"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/60">
              <span className="text-sm text-muted-foreground">Liquidação estimada</span>
              <span className="font-display text-2xl text-gradient-gold">
                R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              type="submit"
              disabled={stage !== "idle"}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stage === "idle" ? (<>Confirmar compra <ArrowRight className="size-4" /></>) : "Processando…"}
            </button>
            <p className="text-xs text-muted-foreground text-center -mt-2">
              Gas patrocinado pelo Paymaster · sem custo para o produtor
            </p>
          </form>

          {/* Status */}
          <div className="glass-card rounded-2xl p-7">
            <h2 className="font-display text-xl mb-6">Ciclo da UserOperation</h2>
            <div className="space-y-4">
              <Step done={stage !== "idle"} active={stage === "bundling"} label="Empacotando UserOperation" sub="Bundler agrupando transação" />
              <Step done={stage === "sponsored" || stage === "settled"} active={stage === "sponsored"} label="Gas patrocinado" sub="Paymaster cobre a taxa de rede" />
              <Step done={stage === "settled"} active={false} label="safeBatchTransferFrom" sub="ERC-1155 · liquidação atômica" />
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
                    Compra registrada on-chain. CASCA_COCO debitada do produtor,
                    COINCONUT_PAY creditada — em uma única transação atômica.
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-3">tx 0x7c4f…91a3</div>
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
