# COINCONUT Design System & Aesthetics

A identidade visual do COINCONUT foi projetada para transmitir **confiança corporativa (B2B), sustentabilidade premium e alta tecnologia (Web3)**. Abandonamos os padrões genéricos de "apps verdes de reciclagem" para adotar uma estética "Web3 Light" sofisticada.

---

## 🎨 Princípios de Design (O Fator UAU)

1. **Luxo Sustentável:** Uso de cores orgânicas, porém com saturação controlada, evocando um sentimento de serviço financeiro premium (Fintech / Wealth Management), essencial para atrair a alta indústria que compra Certificados ESG.
2. **Glassmorphism Funcional:** Elementos de interface como modais, cards de NFTs e painéis B2B utilizam desfoque de fundo (backdrop-blur) para criar profundidade e hierarquia visual, sem perder a legibilidade.
3. **Feedback Dinâmico:** Micro-interações em botões e galerias (como o brilho dourado e os efeitos de *hover* nos Selos ESG) fazem a aplicação parecer viva e recompensadora.

---

## 🖌️ Paleta de Cores (Tokens)

A paleta foge do óbvio. Em vez de verdes fluorescentes, utilizamos tons profundos e beges refinados:

- **Background Principal (`--background`)**: `#fcfbf8` - Um tom de areia/creme off-white que reduz o cansaço visual e remete a materiais orgânicos (papel reciclado/fibra natural).
- **Foreground (Texto Base ` --foreground`)**: `#2C3627` - Um verde floresta extremamente escuro, quase preto, proporcionando alto contraste e elegância formal.
- **Cor Primária (`--primary`)**: `#3f5238` - Verde oliva sofisticado. Usado nos botões principais de Call to Action (CTA).
- **Accent Dourado (`--accent-gold`)**: Elementos de recompensa (Certificados, Botões ZK) utilizam brilhos dourados e sombras brilhantes (`gold-glow: shadow-[0_0_20px_rgba(217,119,6,0.3)]`) para destacar o valor "Soulbound" das conquistas na rede Stellar.

---

## 🔤 Tipografia

Utilizamos tipografias modernas fornecidas pelo Google Fonts que misturam impacto geométrico e alta legibilidade:

1. **Fonte Principal (Textos e UI)**: `Inter` ou `Roboto` (San-serif neutra).
2. **Fonte de Destaque (Títulos)**: `Outfit` ou serifas modernas, garantindo que cabeçalhos como *"Seus Selos ESG"* tenham um peso de design luxuoso e marcante.
3. **Fonte de Código (Terminais e Dados Ocultos ZK)**: Fontes `mono` para dar a sensação imediata de "tecnologia blockchain e criptografia" durante o fluxo do Zero-Knowledge.

---

## 🖼️ Componentes Chave e Experiência do Usuário (UX)

### Galeria ESG (Soulbound NFTs)
Os cards dos certificados foram desenhados para parecerem joias digitais. Eles misturam texturas de fundo (noise/abstract meshes), bordas translúcidas de vidro e um brilho suave que responde ao mouse do usuário, evocando orgulho na indústria que o possui.

### Modal Zero-Knowledge (A Mágica da Privacidade)
No fluxo de emissão ZK (`issue_cert_zk`), o modal passa por uma transformação visual. Ele sai do estilo orgânico e entra num modo "Terminal / Hacking do bem", exibindo linhas de comando para mostrar fisicamente o poder criptográfico da linguagem **Noir** rodando no navegador antes da submissão para a rede Soroban.

---

**Construído com Tailwind CSS v4, Framer Motion e Lucide Icons.**
