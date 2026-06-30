import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import {
  Wifi, WifiOff, Check, AlertCircle, Loader2,
  Leaf, CheckCircle2, Wallet, MapPin, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { CONTRACT_ADDRESSES, submitTransaction } from "@/lib/web3/config";
import * as StellarSdk from "@stellar/stellar-sdk";

export const Route = createFileRoute("/coleta")({
  component: Coleta,
});

const produtores = [
  { id: "p0", name: "Meu Produtor (Teste)", cidade: "Pindoretama, CE", wallet: "GCR5BQRJZU5B6VPZGNRFECSYVPUI5MDQVE6BXNFEL4Y2VWHAQXEK5IMZ", pixKey: "meu@pix.com" }
];

type Stage = "idle" | "aguardando_carteira" | "registrando" | "confirmado";

function Coleta() {
  const { account, isConnecting, connectWallet } = useWeb3();
  const [produtor, setProdutor]     = useState(produtores[0].id);
  const [peso, setPeso]             = useState("80");
  const [stage, setStage]           = useState<Stage>("idle");
  const [qualidade, setQualidade]   = useState({ seca: false, limpa: false, separada: false });
  const [txHash, setTxHash]         = useState<string | null>(null);
  const [errMsg, setErrMsg]         = useState<string | null>(null);
  const connectLock = useRef(false);

  const online      = true;
  const qualidadeOK = qualidade.seca && qualidade.limpa && qualidade.separada;
  const valor       = (Number(peso) || 0) * 2.4;
  const produtorSel = produtores.find((p) => p.id === produtor)!;

  async function handleConnect() {
    if (connectLock.current || isConnecting) return;
    connectLock.current = true;
    try {
      await connectWallet();
    } finally {
      setTimeout(() => { connectLock.current = false; }, 1000);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    if (!qualidadeOK) return;

    if (!account) {
      setStage("aguardando_carteira");
      await handleConnect();
      setStage("idle");
      return;
    }

    setStage("registrando");
    const tId = toast.loading("Assine a transação no Freighter...", { description: "Registrando entrega na Stellar Testnet" });
    try {
      const weightGrams = Math.floor(Number(peso) * 1000);
      
      const args = [
        new StellarSdk.Address(produtorSel.wallet).toScVal(),
        StellarSdk.nativeToScVal(weightGrams, { type: "u32" })
      ];

      toast.loading("Processando na rede...", { id: tId, description: "Aguardando confirmação" });
      
      const { txHash: hash } = await submitTransaction(
        account,
        CONTRACT_ADDRESSES.CoinconutCore,
        "create_batch",
        args
      );

      setTxHash(hash);
      setStage("confirmado");
      toast.success("Entrega certificada com sucesso!", { id: tId });
    } catch (err: any) {
      console.error(err);
      let msg = "Erro ao registrar: " + (err.message || "Erro desconhecido");
      
      setErrMsg(msg);
      toast.error(msg, { id: tId });
      setStage("idle");
    }
  }

  function reset() {
    setStage("idle");
    setPeso("80");
    setQualidade({ seca: false, limpa: false, separada: false });
    setTxHash(null);
    setErrMsg(null);
  }

  const buttonLabel = () => {
    if (stage === "aguardando_carteira") return <><Loader2 className="size-4 animate-spin" /> Aguardando Carteira…</>;
    if (stage === "registrando")         return <><Loader2 className="size-4 animate-spin" /> Assinando transação…</>;
    if (!account)                        return <><Wallet className="size-4" /> Conectar Carteira</>;
    return <><Leaf className="size-4" /> Certificar na Blockchain</>;
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-12">

        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono uppercase tracking-widest text-accent">
            Agente de Coleta · Stellar
          </div>
          <div className="flex items-center gap-3">
            {!account ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting || stage === "aguardando_carteira"}
                className="flex items-center gap-1.5 text-xs font-medium bg-secondary/50 px-3 py-1.5 rounded-full hover:bg-secondary transition disabled:opacity-50"
              >
                <Wallet className="size-3" />
                {isConnecting ? "Conectando…" : "Conectar Wallet"}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
                <Wallet className="size-3" />
                {account.slice(0, 6)}…{account.slice(-4)}
              </div>
            )}
            <div className={`flex items-center gap-1.5 text-xs font-medium ${online ? "text-accent" : "text-amber-500"}`}>
              {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
              {online ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl mb-10">
          Registrar <span className="text-gradient-gold italic">entrega de casca</span>
        </h1>

        <AnimatePresence>
          {errMsg && (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm"
            >
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{errMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {stage !== "confirmado" ? (
            <motion.form key="form" onSubmit={submit} className="space-y-5">

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

              <div className="glass-card rounded-2xl p-7">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-3">
                  Ponto de coleta
                </label>
                {!account ? (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Wallet className="size-4" /> Conecte sua carteira para vincular.
                  </div>
                ) : (
                  <div className="w-full text-left p-4 rounded-xl border border-accent/60 bg-accent/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="size-4 text-accent shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Ponto Padrão (Demo)</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          Vinculado à sua carteira Stellar
                        </div>
                      </div>
                    </div>
                    <Check className="size-4 text-accent" />
                  </div>
                )}
              </div>

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

              <div className="glass-card rounded-2xl p-7">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-4">
                  Checklist de qualidade
                </label>
                <div className="space-y-3">
                  {([
                    { key: "seca"     as const, label: "Casca seca (umidade abaixo de 15%)" },
                    { key: "limpa"    as const, label: "Sem contaminação ou resíduos" },
                    { key: "separada" as const, label: "Separada por lote e produtor" },
                  ]).map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        qualidade[item.key]
                          ? "border-accent/40 bg-accent/5"
                          : "border-border bg-secondary/30 hover:border-border/80"
                      }`}
                    >
                      <div className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                        qualidade[item.key] ? "border-accent bg-accent" : "border-border"
                      }`}>
                        {qualidade[item.key] && <Check className="size-3 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={qualidade[item.key]}
                        onChange={(e) => setQualidade((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
                {!qualidadeOK && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-amber-500">
                    <AlertCircle className="size-3.5" />
                    Confirme os três critérios antes de registrar.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={stage !== "idle" || !qualidadeOK || !peso || !account}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-medium gold-glow hover:scale-[1.01] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {buttonLabel()}
              </button>
              <p className="text-xs text-muted-foreground text-center -mt-2">
                Sem custo para o produtor · Transação registrada na Stellar Testnet
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
              <h2 className="font-display text-3xl mb-2">Entrega registrada on-chain!</h2>
              <p className="text-muted-foreground mb-1">{produtorSel.name} vai receber</p>
              <p className="font-display text-4xl text-gradient-gold mb-6">
                R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-accent hover:underline font-mono bg-secondary/50 px-4 py-2 rounded-lg"
              >
                <ExternalLink className="size-3" />
                Ver no Stellar Expert
              </a>
              <div className="mt-6">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-gold/40 transition text-sm"
                >
                  Registrar outra entrega
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
