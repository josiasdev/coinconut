import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Sprout, Factory, Package, ArrowUpRight, Activity, Leaf, Banknote, TrendingUp, Wifi, Loader2, Wallet } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { getPaymentLedgerContract, getRegistryContract } from "@/lib/web3/config";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Role = "produtor" | "agente" | "fabrica";

const roles: { key: Role; label: string; icon: React.ElementType }[] = [
  { key: "produtor", label: "Produtor", icon: Sprout },
  { key: "agente", label: "Agente de Coleta", icon: Package },
  { key: "fabrica", label: "Fábrica", icon: Factory },
];

// ── Dados mockados ─────────────────────────────────────────────────────────────

const produtorData = {
  nome: "Maria das Graças",
  saldo: 340.80,
  kgMes: 142,
  bonusVerde: 28.00,
  entregas: [
    { data: "28/mai", local: "Posto Pindoretama, CE", kg: 80, valor: 192.00, status: "certificado" },
    { data: "21/mai", local: "Posto Cascavel, CE", kg: 62, valor: 148.80, status: "certificado" },
    { data: "14/mai", local: "Posto Pacajus, CE", kg: 45, valor: 108.00, status: "certificado" },
    { data: "07/mai", local: "Posto Pindoretama, CE", kg: 90, valor: 216.00, status: "certificado" },
  ],
};

const agenteData = {
  nome: "Carlos Mendes",
  posto: "Pindoretama, CE — Rua do Cajueiro",
  registrosHoje: 5,
  kgHoje: 312,
  filaOffline: 0,
  entradas: [
    { hora: "10:45", produtor: "João Batista Pereira", kg: 120, valor: 288.00 },
    { hora: "09:30", produtor: "Maria das Graças Silva", kg: 80, valor: 192.00 },
    { hora: "08:15", produtor: "Francisca Lima", kg: 112, valor: 268.80 },
    { hora: "07:50", produtor: "Antônio Ferreira", kg: 55, valor: 132.00 },
  ],
};

const fabricaData = {
  nome: "Brasil Eco Fibras",
  estoqueKg: 8420,
  produtos: {
    fibra: 2400,
    substrato: 4800,
    chip: 1220,
    briquetes: 3789,
  },
  saldoBRL: 128450,
  compras: [
    { data: "28/mai", produtor: "Maria das Graças Silva (Pindoretama)", kg: 1000, valor: 2400.00 },
    { data: "26/mai", produtor: "Coop. Verde Litoral (Cascavel)", kg: 2500, valor: 6000.00 },
    { data: "20/mai", produtor: "João Batista Pereira (Pacajus)", kg: 800, valor: 1920.00 },
    { data: "15/mai", produtor: "Francisca Lima", kg: 500, valor: 1200.00 },
  ],
};

// ── Componentes auxiliares ─────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className={`absolute -top-10 -right-10 size-36 rounded-full ${color} opacity-20 blur-2xl`} />
      <div className="relative">
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-3 font-display text-3xl">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </div>
    </div>
  );
}

// ── Views por papel ────────────────────────────────────────────────────────────

function ProdutorView() {
  const { account, signer, connectWallet, isConnecting } = useWeb3();
  const [saldoReal, setSaldoReal] = useState<number | null>(null);
  const [kgReal, setKgReal] = useState<number | null>(null);
  const [entregasReais, setEntregasReais] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!signer || !account) return;
      setIsLoading(true);
      try {
        const ledger = getPaymentLedgerContract(signer);
        const registry = getRegistryContract(signer);

        // Busca Saldo
        const pIds = await ledger.getSupplierPayments(account);
        let totalCents = 0;
        for (let i = 0; i < pIds.length; i++) {
          const payment = await ledger.payments(pIds[i]);
          if (Number(payment.status) === 0) totalCents += Number(payment.amountCents);
        }
        setSaldoReal(totalCents / 100);

        // Busca Entregas
        const dIds = await registry.getSupplierDeliveries(account);
        let totalKg = 0;
        const entregas = [];
        // Pega as últimas 5
        const start = Math.max(0, dIds.length - 5);
        for (let i = dIds.length - 1; i >= start; i--) {
          const d = await registry.deliveries(dIds[i]);
          const kg = Number(d.weightGrams) / 1000;
          totalKg += kg;
          
          const date = new Date(Number(d.timestamp) * 1000);
          entregas.push({
            data: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
            local: `Ponto #${d.collectionPointId}`,
            kg: kg,
            valor: Number(d.amountCents) / 100,
            status: "certificado"
          });
        }
        setKgReal(totalKg);
        setEntregasReais(entregas);
      } catch (err) {
        console.error("Erro ao buscar dados do produtor:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [signer, account]);

  const d = produtorData;
  
  // Se estiver conectado, usa dados reais. Senão, usa os mockados para demonstração.
  const isReal = !!account;
  const saldoFinal = isReal && saldoReal !== null ? saldoReal : d.saldo;
  const kgFinal = isReal && kgReal !== null ? kgReal : d.kgMes;
  const entregasFinais = isReal && entregasReais.length > 0 ? entregasReais : d.entregas;

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Sua conta</div>
          <h1 className="font-display text-4xl md:text-5xl">Olá, <span className="text-gradient-gold italic">{isReal ? "Produtor(a)" : d.nome}</span> 👋</h1>
          {!isReal && (
            <button onClick={connectWallet} disabled={isConnecting} className="mt-3 text-xs flex items-center gap-2 text-muted-foreground hover:text-gold transition border border-border px-3 py-1.5 rounded-full">
              {isConnecting ? <Loader2 className="size-3 animate-spin"/> : <Wallet className="size-3"/>}
              Conectar carteira para dados reais
            </button>
          )}
        </div>
        <Link to="/saque" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow">
          Sacar via PIX <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard label={isReal && isLoading ? "Carregando..." : "Disponível para saque"} value={`R$ ${saldoFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} sub="Clique em 'Sacar via PIX'" color="bg-gradient-to-br from-gold to-coconut" />
        <StatCard label={isReal && isLoading ? "Carregando..." : "Entregas on-chain"} value={`${kgFinal} kg`} sub="de casca certificada" color="bg-gradient-to-br from-moss to-accent" />
        <StatCard label="Bônus Verde" value={`R$ ${d.bonusVerde.toFixed(2)}`} sub="Sustentabilidade acumulada" color="bg-gradient-to-br from-accent to-moss" />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl mb-5 flex items-center gap-2">
          <Leaf className="size-4 text-accent" /> 
          Suas entregas recentes {isReal && <span className="text-[10px] font-mono px-2 py-0.5 bg-accent/20 text-accent rounded uppercase">Ao vivo na rede</span>}
        </h2>
        <div className="space-y-2">
          {entregasFinais.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition border border-transparent hover:border-border">
              <div>
                <div className="text-sm">{e.local}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{e.data} · {e.kg} kg</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">R$ {e.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-accent mt-0.5">✓ Certificado</div>
              </div>
            </motion.div>
          ))}
          {isReal && entregasFinais.length === 0 && !isLoading && (
            <div className="text-center py-6 text-sm text-muted-foreground italic">Nenhuma entrega registrada ainda.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgenteView() {
  const d = agenteData;
  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">{d.posto}</div>
          <h1 className="font-display text-4xl md:text-5xl">Olá, <span className="text-gradient-gold italic">{d.nome}</span> 👋</h1>
        </div>
        <Link to="/coleta" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow">
          Registrar entrega <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Registros hoje" value={`${d.registrosHoje}`} sub="entregas certificadas" color="bg-gradient-to-br from-gold to-coconut" />
        <StatCard label="Kg certificados hoje" value={`${d.kgHoje} kg`} color="bg-gradient-to-br from-moss to-accent" />
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className={`size-10 rounded-full grid place-items-center ${d.filaOffline === 0 ? "bg-accent/20" : "bg-amber-500/20"}`}>
            <Wifi className={`size-4 ${d.filaOffline === 0 ? "text-accent" : "text-amber-500"}`} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Fila offline</div>
            <div className="font-display text-2xl mt-1">{d.filaOffline === 0 ? "Nenhuma" : `${d.filaOffline} pendente`}</div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl mb-5 flex items-center gap-2"><Activity className="size-4 text-gold" /> Entradas de hoje</h2>
        <div className="space-y-2">
          {d.entradas.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition border border-transparent hover:border-border">
              <div>
                <div className="text-sm">{e.produtor}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{e.hora} · {e.kg} kg</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">R$ {e.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-accent mt-0.5">✓ Certificado</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FabricaView() {
  const d = fabricaData;
  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">Conta empresarial</div>
          <h1 className="font-display text-4xl md:text-5xl"><span className="text-gradient-gold italic">Olá, Fábrica</span> 👋</h1>
          <p className="text-xs text-muted-foreground mt-1">{d.nome}</p>
        </div>
        <Link to="/registrar" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow">
          Registrar compra <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Estoque de casca" value={`${d.estoqueKg.toLocaleString("pt-BR")} kg`} sub="matéria-prima" color="bg-gradient-to-br from-coconut to-gold" />
        <StatCard label="Fibra produzida" value={`${d.produtos.fibra.toLocaleString("pt-BR")} kg`} sub="produto acabado" color="bg-gradient-to-br from-moss to-accent" />
        <StatCard label="Substrato / Pó" value={`${d.produtos.substrato.toLocaleString("pt-BR")} kg`} sub="produto acabado" color="bg-gradient-to-br from-moss to-accent" />
        <StatCard label="Chip / Briquete" value={`${(d.produtos.chip + d.produtos.briquetes).toLocaleString("pt-BR")} kg`} sub="produto acabado" color="bg-gradient-to-br from-moss to-accent" />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl mb-5 flex items-center gap-2"><TrendingUp className="size-4 text-gold" /> Compras recentes</h2>
        <div className="space-y-2">
          {d.compras.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition border border-transparent hover:border-border">
              <div>
                <div className="text-sm">{c.produtor}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.data} · {c.kg.toLocaleString("pt-BR")} kg</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-accent mt-0.5">✓ Pago</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────────────────────────

function Dashboard() {
  const [role, setRole] = useState<Role>("produtor");

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">

        {/* Role switcher */}
        <div className="mb-8 flex items-center gap-1 p-1 rounded-full border border-border/60 bg-secondary/30 w-fit">
          <span className="text-xs text-muted-foreground px-3 font-mono">Demo:</span>
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
                role === r.key
                  ? "bg-gradient-to-br from-gold to-[oklch(0.72_0.18_60)] text-gold-foreground font-medium gold-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <r.icon className="size-3.5" />
              {r.label}
            </button>
          ))}
        </div>

        {/* Role view */}
        <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {role === "produtor" && <ProdutorView />}
          {role === "agente" && <AgenteView />}
          {role === "fabrica" && <FabricaView />}
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
