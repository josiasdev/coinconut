import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sprout, MapPin, Factory, ArrowRight, Loader2, Wallet } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useWeb3 } from "@/hooks/useWeb3";
import { toast } from "sonner";
import { motion } from "motion/react";

export const Route = createFileRoute("/login")({
  component: Login,
});

type Role = "coletor" | "ponto_coleta" | "industria" | null;

const roles = [
  {
    id: "coletor" as Role,
    title: "Coletor",
    description: "Acompanhe suas entregas e receba pagamentos",
    icon: Sprout,
    route: "/dashboard",
  },
  {
    id: "ponto_coleta" as Role,
    title: "Ponto de Coleta",
    description: "Registre o recebimento de cascas de coco",
    icon: MapPin,
    route: "/coleta",
  },
  {
    id: "industria" as Role,
    title: "Indústria",
    description: "Certifique lotes e autorize pagamentos",
    icon: Factory,
    route: "/registrar",
  },
];

function Login() {
  const { account, isConnecting, connectWallet } = useWeb3();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const router = useRouter();

  // Redireciona automaticamente quando a carteira estiver conectada e o perfil selecionado
  useEffect(() => {
    if (account && selectedRole) {
      const targetRoute = roles.find(r => r.id === selectedRole)?.route;
      if (targetRoute) {
        toast.success(`Carteira conectada! Entrando como ${roles.find(r => r.id === selectedRole)?.title}`);
        setTimeout(() => {
          router.navigate({ to: targetRoute });
        }, 1500); // pequeno atraso para o usuário ver a mensagem de sucesso
      }
    }
  }, [account, selectedRole, router]);

  async function handleLogin() {
    if (!selectedRole) {
      toast.error("Por favor, selecione um perfil para entrar.");
      return;
    }
    await connectWallet();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl mb-3">
              Acesse a <span className="text-gradient-gold italic">plataforma</span>
            </h1>
            <p className="text-muted-foreground">
              Selecione seu perfil e conecte sua carteira para continuar.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <role.icon className={`size-8 mb-4 ${selectedRole === role.id ? "text-primary" : "opacity-70"}`} />
                  <h3 className={`font-display text-lg mb-1 ${selectedRole === role.id ? "text-foreground" : ""}`}>
                    {role.title}
                  </h3>
                  <p className="text-xs opacity-70 leading-relaxed">
                    {role.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border/50">
              <button
                onClick={handleLogin}
                disabled={!selectedRole || isConnecting || !!account}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-medium gold-glow hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isConnecting || (account && selectedRole) ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Wallet className="size-5" />
                    {account ? "Carteira já conectada" : "Conectar Carteira (MetaMask)"}
                    <ArrowRight className="size-4 ml-1" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                É necessário possuir a extensão da MetaMask instalada no navegador.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
