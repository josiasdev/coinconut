export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-gradient-to-br from-gold to-coconut" />
          <span className="font-display">COINCONUT</span>
          <span className="opacity-60">Da casca ao pagamento, rastreado.</span>
        </div>
        <div className="text-xs opacity-70">
          Hackathon Web3 RESTIC 29 · ImpactLedger · 2026
        </div>
      </div>
    </footer>
  );
}
