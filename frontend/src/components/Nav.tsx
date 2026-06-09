import { Link } from "@tanstack/react-router";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function Nav() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="COINCONUT Logo" className="size-8 rounded-full object-cover gold-glow" />
          <span className="font-display text-xl tracking-tight">
            COIN<span className="text-gradient-gold font-bold">CONUT</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-7 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
              Início
            </Link>
            <Link to="/transparencia" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              Portal de Transparência
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
            className="size-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-secondary/50 transition-all"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>

      </nav>
    </header>
  );
}
