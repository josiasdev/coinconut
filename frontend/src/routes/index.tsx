import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sprout, Factory, Building2, Flame, Shield, Zap } from "lucide-react";
import heroImg from "@/assets/hero-coconut.jpg";
import briquettesImg from "@/assets/briquettes.jpg";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Landing,
});

const actors = [
  { icon: Sprout, name: "Produtor", role: "Fornece a matéria-prima", token: "CASCA_COCO", color: "from-moss to-accent" },
  { icon: Factory, name: "Fábrica", role: "Transforma e revende", token: "BRIQUETE", color: "from-coconut to-gold" },
  { icon: Building2, name: "Compradora", role: "Adquire o produto certificado", token: "COINCONUT_PAY", color: "from-gold to-[oklch(0.72_0.18_60)]" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.05fr_1fr] gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-xs font-mono uppercase tracking-widest text-gold mb-6"
            >
              <span className="size-1.5 rounded-full bg-gold animate-pulse" /> MVP · ERC-4337
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight"
            >
              A casca do coco<br />
              vira <span className="text-gradient-gold italic">ativo digital.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl"
            >
              Do produtor à fábrica de briquetes — pagamento, logística e queima
              de tokens em <span className="text-foreground">uma única transação atômica</span>.
              Sem seed phrase, sem pop-up de extensão, sem gas para o produtor.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow hover:scale-[1.02] transition"
              >
                Abrir Dashboard
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/registrar"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border hover:border-gold/40 hover:bg-card transition"
              >
                Registrar compra
              </Link>
            </motion.div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { k: "0", l: "gas para o produtor" },
                { k: "1tx", l: "$ + carga + queima" },
                { k: "100%", l: "auditável on-chain" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="font-display text-3xl text-gradient-gold">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}
            className="relative aspect-square rounded-3xl overflow-hidden glass-card"
          >
            <img src={heroImg} alt="Casca de coco com circuitos dourados" className="w-full h-full object-cover" width={1536} height={1536} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 font-mono text-xs space-y-1">
              <div className="text-gold/80">{"// Smart Contract"}</div>
              <div className="text-foreground/90">COINCONUT.safeBatchTransferFrom()</div>
              <div className="text-muted-foreground">↳ paymaster sponsored · bundled</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Atores */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">03 atores · 01 contrato</div>
          <h2 className="font-display text-4xl md:text-5xl">Três carteiras inteligentes,<br />uma economia sincronizada.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {actors.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-7 hover:border-gold/30 transition group"
            >
              <div className={`size-12 rounded-xl bg-gradient-to-br ${a.color} grid place-items-center mb-5`}>
                <a.icon className="size-6 text-background" strokeWidth={2} />
              </div>
              <div className="font-display text-2xl">{a.name}</div>
              <p className="text-sm text-muted-foreground mt-1">{a.role}</p>
              <div className="mt-6 pt-5 border-t border-border/50 font-mono text-xs flex items-center justify-between">
                <span className="text-muted-foreground">token</span>
                <span className="text-gold">{a.token}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fluxo / RF06 */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card order-2 lg:order-1"
          >
            <img src={briquettesImg} alt="Briquetes de coco" className="w-full h-full object-cover" loading="lazy" width={1280} height={960} />
          </motion.div>
          <div className="order-1 lg:order-2">
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">RF06 · transformação física</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Queima a matéria-prima,<br />
              <span className="text-gradient-gold italic">cunha o produto.</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg">
              Quando a fábrica transforma a casca em briquete, o contrato executa
              um <span className="text-foreground">burn</span> dos tokens de matéria-prima
              (ID 1) na proporção exata de um <span className="text-foreground">mint</span> de
              tokens de produto acabado (ID 2). A física e a contabilidade andam juntas.
            </p>

            <div className="mt-10 space-y-3 font-mono text-sm">
              <FlowRow from="CASCA_COCO" amount="-1.000 kg" type="burn" />
              <FlowRow from="BRIQUETE" amount="+450 kg" type="mint" />
              <FlowRow from="COINCONUT_PAY" amount="liquidação" type="atomic" />
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Shield, t: "Smart Accounts", d: "Login social via ERC-4337. Sem seed phrase, sem complexidade." },
            { icon: Zap, t: "Bundler + Paymaster", d: "Transações empacotadas e patrocinadas. Custo zero para o produtor." },
            { icon: Flame, t: "ERC-1155 Multi-Token", d: "Ativos físicos e financeiros consolidados em um único contrato." },
          ].map((f) => (
            <div key={f.t} className="glass-card rounded-2xl p-7">
              <f.icon className="size-5 text-gold mb-4" />
              <div className="font-display text-xl">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-moss/10" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl">Pronto para tokenizar sua cadeia?</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Abra o dashboard e simule uma compra UC01 — do produtor à fábrica,
              com liquidação atômica.
            </p>
            <Link
              to="/registrar"
              className="inline-flex items-center gap-2 mt-8 px-7 py-4 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow hover:scale-[1.02] transition"
            >
              Iniciar UC01 — Registrar compra
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FlowRow({ from, amount, type }: { from: string; amount: string; type: "burn" | "mint" | "atomic" }) {
  const colors = {
    burn: "text-destructive border-destructive/30 bg-destructive/5",
    mint: "text-accent border-accent/30 bg-accent/5",
    atomic: "text-gold border-gold/30 bg-gold/5",
  } as const;
  return (
    <div className="flex items-center justify-between p-4 rounded-xl glass-card">
      <span className="text-muted-foreground">{from}</span>
      <div className="flex items-center gap-3">
        <span>{amount}</span>
        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest border ${colors[type]}`}>{type}</span>
      </div>
    </div>
  );
}
