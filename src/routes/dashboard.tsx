import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Sprout, Factory, Building2, Activity } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — COINCONUT" },
      { name: "description", content: "Visão geral on-chain da cadeia da casca de coco: saldos, transações e atores." },
    ],
  }),
  component: Dashboard,
});

const balances = [
  { token: "COINCONUT_PAY", id: "#0", amount: "128.450,00", unit: "CCP", color: "from-gold to-[oklch(0.72_0.18_60)]" },
  { token: "CASCA_COCO", id: "#1", amount: "8.420", unit: "kg", color: "from-coconut to-gold" },
  { token: "BRIQUETE", id: "#2", amount: "3.789", unit: "kg", color: "from-moss to-accent" },
];

const txs = [
  { actor: "Fábrica → Produtor", op: "compra · CASCA_COCO", amount: "1.000 kg", value: "R$ 2.400", status: "atomic", time: "há 2min", hash: "0x8af3…b21c" },
  { actor: "Fábrica (burn → mint)", op: "RF06 · transformação", amount: "1.000 → 450 kg", value: "—", status: "mint", time: "há 14min", hash: "0x1c92…ee0d" },
  { actor: "Empresa Y → Fábrica", op: "venda · BRIQUETE", amount: "200 kg", value: "R$ 1.800", status: "atomic", time: "há 1h", hash: "0xa4ff…3092" },
  { actor: "Produtor Maria S.", op: "onboarding · Social Login", amount: "—", value: "—", status: "info", time: "há 3h", hash: "0x33de…a112" },
];

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Carteira da Fábrica · 0xB7…f3A1</div>
            <h1 className="font-display text-4xl md:text-5xl">Boa tarde, <span className="text-gradient-gold italic">Fábrica</span>.</h1>
          </div>
          <Link to="/registrar" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow">
            Nova compra <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Balances */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {balances.map((b, i) => (
            <motion.div
              key={b.token}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
            >
              <div className={`absolute -top-12 -right-12 size-40 rounded-full bg-gradient-to-br ${b.color} opacity-20 blur-2xl`} />
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-muted-foreground">{b.token}</span>
                <span className="text-gold/80">ID {b.id}</span>
              </div>
              <div className="mt-5 font-display text-4xl">{b.amount}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{b.unit}</div>
            </motion.div>
          ))}
        </div>

        {/* Atores ativos */}
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-4">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="size-4 text-gold" />
              <h2 className="font-display text-xl">Rede ativa</h2>
            </div>
            <div className="space-y-3">
              {[
                { icon: Sprout, label: "Produtores", count: 24, color: "text-accent" },
                { icon: Factory, label: "Fábricas", count: 3, color: "text-gold" },
                { icon: Building2, label: "Compradoras", count: 11, color: "text-coconut" },
              ].map((a) => (
                <div key={a.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40">
                  <div className="flex items-center gap-3">
                    <a.icon className={`size-4 ${a.color}`} />
                    <span className="text-sm">{a.label}</span>
                  </div>
                  <span className="font-mono text-sm">{a.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tx Feed */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-xl mb-5">Eventos on-chain</h2>
            <div className="space-y-2">
              {txs.map((tx, i) => (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[1fr_auto] gap-4 p-4 rounded-xl hover:bg-secondary/40 transition border border-transparent hover:border-border"
                >
                  <div className="min-w-0">
                    <div className="text-sm truncate">{tx.actor}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tx.op}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{tx.amount}</div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{tx.hash} · {tx.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
