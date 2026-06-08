import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-gradient-to-br from-gold to-coconut grid place-items-center text-background font-display font-bold gold-glow">
            ◉
          </div>
          <span className="font-display text-xl tracking-tight">
            COIN<span className="text-gradient-gold font-bold">CONUT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
            Início
          </Link>
          <Link to="/transparencia" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
            Portal de Transparência
          </Link>
        </div>

      </nav>
    </header>
  );
}
