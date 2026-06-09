import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="COINCONUT Logo" className="h-10 w-auto object-contain mix-blend-multiply" />
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

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>

      </nav>
    </header>
  );
}
