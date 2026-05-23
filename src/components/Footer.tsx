export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-gradient-to-br from-gold to-coconut" />
          <span className="font-display">COINCONUT</span>
          <span className="opacity-60">— Cadeia da casca, on-chain.</span>
        </div>
        <div className="font-mono text-xs opacity-70">
          ERC-4337 · ERC-1155 · Account Abstraction
        </div>
      </div>
    </footer>
  );
}
