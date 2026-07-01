# Documentação do Smart Contract (Soroban / Rust)

Este documento provê uma visão detalhada do Smart Contract desenvolvido para o ecossistema **COINCONUT** na rede **Stellar**.

Para o PULSO Hackathon, migramos nossa antiga infraestrutura EVM para um modelo unificado, eficiente e seguro, construído inteiramente em **Rust** utilizando o **Soroban SDK**.

---

## Estrutura do Contrato (`CoinconutContract`)

Todo o ciclo logístico e a emissão de certificados ESG ocorrem no escopo do contrato central, cujas estruturas principais são:

### 1. `Batch` (O Resíduo Físico e Rastreamento)
Representa o lote de casca de coco do momento em que é coletado (Estágio 0) até se tornar um produto com valor de mercado (Estágios 1 e 2).
- **Mecânica de Emissão:** A função `create_batch(supplier, weight_grams)` é chamada pelo Ecoponto, cunhando o rastreio inicial e associando o fornecedor (Endereço Stellar do catador).
- **Mecânica de Transformação:** A função `advance_stage(batch_id)` altera o estado físico documentado na rede, certificando de que a mesma matéria-prima não seja contada ou processada em duplicidade na plataforma.
- **Destinação Final:** `finalize_as_adubo(batch_id)` é uma rota rápida e sustentável caso o material não tenha qualidade para ser convertido em Fibra/Briquetes, servindo diretamente como biomassa/adubo.

### 2. `Certificate` (Certificado ImpactLedger / Selo ESG)
O certificado de impacto ecológico final. Na arquitetura antiga (EVM) era tratado como um NFT (ERC-721). Na Stellar, utilizamos uma abordagem limpa através de armazenamento de dados nativo no Soroban.
- **Estrutura:** `DataKey::Certificate(u32)` armazena no estado do contrato atributos cruciais: `buyer` (Dono do certificado), `batch_id` (Lote vinculado), `weight_grams` (Impacto quantitativo) e `product_type` (Tipo do resíduo processado).
- **Mecânica Principal:** `issue_cert(buyer, batch_id, weight_grams, product_type)` atrela de forma irrevogável o peso e a glória da reciclagem ao endereço (Address) do comprador B2B. Essa propriedade não possui uma função de transferência (transfer), tornando-se análoga ao conceito de "Soulbound", evitando o comércio secundário de reputação ambiental (Greenwashing).

### 3. Integração de Privacidade Zero-Knowledge (Noir)
Para garantir a confidencialidade da cadeia de suprimentos B2B (Supply Chain Privacy), introduzimos a função paralela `issue_cert_zk`.
- **Mecânica Confidencial:** Em vez de transmitir pesos logísticos exatos abertamente, a indústria usa a linguagem **Noir** (ZK-SNARK) para gerar uma prova matemática de que o requisito ESG foi cumprido.
- **Validação on-chain:** O Smart Contract Soroban recebe e verifica essa prova criptográfica (UltraHonk). Se for válida, ele emite o Selo ESG mantendo o lote oculto (`batch_id: 0`), garantindo que volumes de produção reais não sejam espionados por concorrentes no explorador público.

---

## Estratégias de Usabilidade e Taxas (Fee Bumps)

Enquanto redes convencionais exigem abstração de contas baseadas em contratos pesados (Paymasters), a migração para a **Stellar** solucionou naturalmente o atrito do pagamento do "Gás" pelo usuário final:

- **Fee Bumps Nativo:** As transações orquestradas pelo frontend no dispositivo do Ecoponto ou Produtor podem ter a taxa de rede patrocinada pela plataforma ou pela indústria final. O catador assina apenas os parâmetros da função, sem necessitar deter fundos XLM na sua conta local. Isso permite uma adesão orgânica de populações desbancarizadas e sem afinidade técnica.

---

## Segurança e Edge Cases Tratados (Testes Unitários)

Nossa bateria de testes unitários (`test.rs`) cobre nativamente na VM local os seguintes cenários de segurança:
- **Controle de Fluxo Físico:** Lotes não podem ter seu estágio avançado de forma aleatória ou regredida; o processo obedece o lifecycle biológico/industrial.
- **Bloqueio de Emissão Dupla de ESG:** É impossível emitir um certificado ESG duplo (Greenwashing duplo) com base no mesmo `batch_id`.
- **Validação Nativa Rust:** Tipagem segura do Rust que impede overflows em conversões de peso do material físico ou contadores corrompidos (`BatchCount` / `CertCount`).
