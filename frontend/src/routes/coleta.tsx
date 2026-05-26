import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Wifi, WifiOff, Check, AlertCircle, Loader2, Leaf, CheckCircle2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/coleta")({
  component: Coleta,
});

const produtores = [
  { id: "p1", name: "Maria das Graças Silva", cidade: "Limoeiro do Norte, CE" },
  { id: "p2", name: "João Batista Pereira", cidade: "Aracati, CE" },
  { id: "p3", name: "Francisca Lima", cidade: "Mossoró, RN" },
  { id: "p4", name: "Antônio Ferreira", cidade: "Pacajus, CE" },
];

type Stage = "idle" | "registrando" | "confirmado";

function Coleta() {
  const [produtor, setProdutor] = useState(produtores[0].id);
  const [peso, setPeso] = useState("80");
  const [stage, setStage] = useState<Stage>("idle");
  const [qualidade, setQualidade] = useState({ seca: false, limpa: false, separada: false });
  const online = true;

  const qualidadeOK = qualidade.seca && qualidade.limpa && qualidade.separada;
  const valor = (Number(peso) || 0) * 2.4;
  const produtorSel = produtores.find((p) => p.id === produtor)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!qualidadeOK) return;
    setStage("registrando");
    await new Promise((r) => setTimeout(r, 2000));
    setStage("confirmado");
  }

  function reset() {
    setStage("idle");
    setPeso("80");
    setQualidade({ seca: false, limpa: false, separada: false });
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-12">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono uppercase tracking-widest text-accent">
            Posto de Coleta · Agente
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${online ? "text-accent" : "text-amber-500"}`}
          >
            {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            {online ? "Online" : "Offline — fila ativa"}
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl mb-10">
          Registrar <span className="text-gradient-gold italic">entrega de casca</span>
        </h1>

        <AnimatePresence mode="wait">
          {stage !== "confirmado" ? (
            <motion.form key="form" onSubmit={submit} className="space-y-5">

              {/* Produtor */}
              <div className="glass-card rounded-2xl p-7">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-3">
                  Produtor
                </label>
                <div className="space-y-2">
                  {produtores.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProdutor(p.id)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                        produtor === p.id
                          ? "border-gold/60 bg-gold/5"
                          : "border-border hover:border-border/80 bg-secondary/30"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.cidade}</div>
                      </div>
                      {produtor === p.id && <Check className="size-4 text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Peso */}
              <div className="glass-card rounded-2xl p-7">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-3">
                  Peso da entrega (kg)
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min={1}
                  max={500}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3.5 font-display text-3xl focus:outline-none focus:border-gold/60 transition"
                />
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Produtor vai receber</span>
                  <span className="font-display text-xl text-gradient-gold">
                    R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Qualidade */}
              <div className="glass-card rounded-2xl p-7">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">
                  Checklist de qualidade
                </label>
                <div className="space-y-3">
                  {(
                    [
                      { key: "seca" as const, label: "Casca seca (umidade abaixo de 15%)" },
                      { key: "limpa" as const, label: "Sem contaminação ou resíduos" },
                      { key: "separada" as const, label: "Separada por lote e produtor" },
                    ] as const
                  ).map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        qualidade[item.key]
                          ? "border-accent/40 bg-accent/5"
                          : "border-border bg-secondary/30 hover:border-border/80"
                      }`}
                    >
                      <div
                        className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                          qualidade[item.key] ? "border-accent bg-accent" : "border-border"
                        }`}
                      >
                        {qualidade[item.key] && <Check className="size-3 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={qualidade[item.key]}
                        onChange={(e) =>
                          setQualidade((prev) => ({ ...prev, [item.key]: e.target.checked }))
                        }
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
                {!qualidadeOK && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-amber-500">
                    <AlertCircle className="size-3.5" />
                    Confirme os critérios de qualidade antes de registrar.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={stage !== "idle" || !qualidadeOK || !peso}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {stage === "registrando" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Certificando entrega...
                  </>
                ) : (
                  <>
                    <Leaf className="size-4" /> Certificar entrega
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center -mt-2">
                Sem custo para o produtor · Pagamento enviado automaticamente
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-10 text-center"
            >
              <div className="size-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-gold/10 border border-accent/30 grid place-items-center">
                <CheckCircle2 className="size-10 text-accent" />
              </div>
              <h2 className="font-display text-3xl mb-2">Entrega certificada!</h2>
              <p className="text-muted-foreground mb-1">{produtorSel.name} vai receber</p>
              <p className="font-display text-4xl text-gradient-gold mb-6">
                R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <div className="text-xs text-muted-foreground mb-8 font-mono">
                Comprovante #{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-gold/40 transition text-sm"
              >
                Registrar outra entrega
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
