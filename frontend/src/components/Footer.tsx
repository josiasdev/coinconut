export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="COINCONUT Logo" className="h-8 w-auto object-contain mix-blend-multiply" />
          <span className="font-display">COINCONUT</span>
          <span className="opacity-60">Da casca ao pagamento, rastreado.</span>
        </div>
      </div>
    </footer>
  );
}
