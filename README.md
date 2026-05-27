# 🥥 COINCONUT — Cadeia da Casca de Coco, Rastreada

> **Hackathon Web3 RESTIC 29 · Desafio ImpactLedger**

Plataforma que conecta **produtores rurais**, **postos de coleta** e **fábricas de briquetes** em uma cadeia de suprimentos transparente — com pagamento via PIX, rastreabilidade total e custo zero para o produtor.

---

## 🔗 Smart Contracts Deployados (Sepolia Testnet)

| Contrato | Endereço | Link Etherscan |
|---|---|---|
| **CocoAsset** | `0x9613...2bcb` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x961379292204ED01DC6436dC2db666f5E9532bCb) |
| **CoconutRegistry** | `0xF6f3...2E70` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70) |
| **PaymentLedger** | `0x80d9...Ed64` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x80d9A97CEE8F8530888879d09fc1010082aFEd64) |
| **BriquetteMarket** | `0xFFd4...DA8e` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e) |
| **SustainabilityNFT** | `0x6C3a...4619` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619) |
| **CoinconutPaymaster**| `0x0911...72bA` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x09111165AC75767E23926bfAA56C884bCD1172bA) |


---

## 🌍 O Problema

O coco é uma das culturas mais importantes do agronegócio brasileiro. Em 2021, a produção mundial foi de 63 milhões de toneladas, com o **Brasil sendo o 5º maior produtor** (4,5% do total). O Nordeste concentra 81% da área plantada, e **o Ceará é o 2º maior produtor em área plantada** no país.

A casca representa ~85% do peso do fruto. Com a magnitude desses números, o descarte inadequado cria um **problema ambiental gigantesco**, com grande parte do resíduo parando em aterros sanitários e lixões urbanos.

A cadeia atual de reciclagem dessa casca sofre de:

- **Pagamentos atrasados e informais** para produtores rurais
- **Sem rastreabilidade**: impossível provar a origem sustentável da matéria-prima
- **Desconfiança**: produtores não sabem quanto vão receber ou quando
- **Impacto invisível**: sem dados auditáveis de sustentabilidade

## ⚖️ Marco Legal e Desafio Logístico

Este MVP foi desenhado para viabilizar os objetivos da **Política Nacional de Resíduos Sólidos (PNRS - Lei nº 12.305/2010)** e se antecipar às diretrizes do **Projeto de Lei nº 616/2024**, que propõe a inclusão de sistemas de coleta seletiva e logística reversa específicos para o coco verde.

A implementação da logística reversa para a casca do coco é complexa porque:
- **O comércio é difuso e informal:** o consumo ocorre em pontos pulverizados (praias, comércio de rua), dificultando a organização da coleta.
- **Custos operacionais elevados:** recolher volumes fracionados de um resíduo pesado, mas de baixo valor comercial bruto, onera toda a cadeia.
- **Falta de rastreabilidade:** não existem mecanismos práticos para auditar os volumes devolvidos ao ciclo produtivo e recompensar os agentes responsáveis (catadores, cooperativas e pequenos produtores).

A proposta do PL 616/2024, em debate na Comissão de Desenvolvimento Urbano, faculta a estados e municípios estruturarem essa logística, de preferência com associações de catadores.

Para que a reciclagem (transformação em fibra, substrato, pó e bioenergia) seja economicamente viável e transparente, é necessária uma inovação estrutural. O **COINCONUT** atua fornecendo a infraestrutura financeira, tecnológica e logística que comprova a destinação correta e desburocratiza a remuneração de quem coleta.

## 💡 A Solução

O **COINCONUT** digitaliza toda a cadeia — da coleta ao briquete — usando blockchain como infraestrutura invisível:

| Para o produtor | Para a fábrica | Para o comprador |
|---|---|---|
| Entrega a casca e recebe via PIX | Compra matéria-prima certificada | Adquire briquete com selo de origem |
| Sem cadastro complicado | Rastreabilidade da origem ao produto | Auditabilidade automática |
| Custo zero — sem taxas | Estoque e pagamentos integrados | Certificação de impacto social |

**O usuário final não precisa saber que tem blockchain.** Ele só sabe que funciona.

## 🏗️ Arquitetura

```
┌───────────────────────────────────────────────────────────┐
│                   FRONTEND (Vite SPA)                     │
│   React 19 · TanStack Router · Tailwind CSS v4            │
│   Motion (Framer) · Radix UI · Recharts                   │
└──────────────────────┬────────────────────────────┬───────┘
                       │                        │
          ┌────────────┼───────────────┐        ▼
          ▼            ▼               ▼   ┌─────────────────────┐
   ┌─────────────┐ ┌───────────────┐ ┌───────────────┐ │ EntryPoint / ERC-4337 │
   │ CoconutRegistry│ │ BriquetteMarket│ │   Paymaster   │ └─────────────────────┘
   │ (registro)     │ │ (marketplace)  │ │ (gas sponsor) │
   └────┬──────────┘ └────┬───────────┘ └────┬───────────┘
        │                 │                 │
        ▼                 ▼                 ▼
   ┌──────────────┐ ┌──────────────────┐ ┌────────────────┐
   │  CocoAsset   │ │ PaymentLedger     │ │ SustainabilityNFT │
   │  (ERC-1155)  │ │ (pagamentos PIX)  │ │ (NFT soulbound)   │
   └──────────────┘ └──────────────────┘ └────────────────┘
```
### Contratos Inteligentes (implementados neste repositório)

| Contrato | Padrão | Função |
|---|---|---|
| **CocoAsset.sol** | ERC-1155 | Representa batches de coco e acompanha a transformação física da casca até briquete ou adubo |
| **CoconutRegistry.sol** | Custom | Registra entregas, controla operadores, calcula pagamento e orquestra batchs |
| **PaymentLedger.sol** | Custom | Livro de pagamentos on-chain para obrigações PIX com status `PENDING`, `PAID` e `FAILED` |
| **BriquetteMarket.sol** | Custom | Marketplace para venda de briquetes/adubo que emite NFT sustentável e cria pagamento |
| **SustainabilityNFT.sol** | ERC-721 soulbound | Certificado imutável de compra sustentável, não transferível após emissão |
| **CoinconutPaymaster.sol** | ERC-4337 | Patrocina gas para transações em contratos autorizados via EntryPoint |

## 📱 Funcionalidades da Plataforma

### Telas implementadas

| Rota | Papel | Descrição |
|---|---|---|
| `/` | Público | Landing page com proposta de valor e fluxo da cadeia |
| `/dashboard` | Todos | Painel com visão por papel (Produtor / Agente / Fábrica) |
| `/coleta` | Agente de Coleta | Registro de entrega com checklist de qualidade |
| `/registrar` | Fábrica | Compra de matéria-prima do produtor |
| `/saque` | Produtor | Saque via PIX com timeline de progresso |

### Integração Web3 (Ao Vivo na Sepolia)

O frontend deixou de ser apenas um mock e agora está **100% integrado aos Smart Contracts na Sepolia**:

- **Conexão MetaMask (`useWeb3`)**: Todas as transações financeiras e de logística exigem assinatura Web3.
- **Produtores (Teste)**: O sistema permite usar sua própria carteira ("Meu Produtor") para testar o fluxo de ponta a ponta.
- **Rastreabilidade Dinâmica**: O dashboard consulta saldos e entregas diretamente do `PaymentLedger` e do `CoconutRegistry`.

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Uso |
|---|---|
| **React 19** | UI |
| **Vite 7** | Build |
| **TanStack Router** | Roteamento file-based |
| **Tailwind CSS v4** | Estilos |
| **Motion (Framer Motion)** | Animações |
| **Radix UI** | Componentes acessíveis |
| **Lucide React** | Ícones |
| **TypeScript** | Tipagem |

### Infraestrutura

| Tecnologia | Uso |
|---|---|
| **Vercel** | Deploy do frontend |
| **Solidity** | Contratos inteligentes |
| **Hardhat** | Framework de desenvolvimento EVM |
| **ERC-4337** | Account Abstraction (login social) |

## 🚀 Como Executar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/) ou [Bun](https://bun.sh/)
- Git

### Instalar dependências do projeto

```bash
# Na raiz do repositório
npm install --legacy-peer-deps

# Frontend
cd frontend
bun install   # ou npm install
```

### 🌐 Deploy de Smart Contracts na Sepolia

Para fazer o deploy dos contratos na testnet pública Sepolia, siga os passos abaixo:

#### 1. Antes do deploy (Preparação)

**SEPOLIA_RPC_URL**
1. Acesse [infura.io](https://infura.io) → crie uma conta → clique em **Create New API Key**.
2. Selecione Web3 API → dê um nome qualquer.
3. No painel do projeto, copie o endpoint HTTPS da Sepolia:
   `SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/abc123sua_chave`

**PRIVATE_KEY**
É a chave privada da carteira que vai fazer o deploy e ser o *owner* de todos os contratos (quem pode setar preço, adicionar pontos de coleta e autorizar operadores).
1. Abra o MetaMask → clique no ícone da conta (canto superior direito).
2. Detalhes da conta → Exportar chave privada → digite sua senha.
3. Cole no arquivo `.env` **sem o 0x** no início:
   `PRIVATE_KEY=sua_chave_de_64_caracteres_aqui`
> *Nota: Essa conta precisa ter ETH de teste na Sepolia. Faucet: [sepoliafaucet.com](https://sepoliafaucet.com)*

**ETHERSCAN_API_KEY** *(opcional — só para verificar contratos)*
1. Acesse [etherscan.io](https://etherscan.io) → crie uma conta.
2. Menu do perfil → API Keys → Add → copie a chave:
   `ETHERSCAN_API_KEY=sua_chave_etherscan`

#### 2. Executando o deploy

Rode o script de deploy:
```bash
npm run deploy
# ou: npx hardhat run scripts/deploy.js --network sepolia
```

O terminal vai imprimir os endereços gerados:
```text
CocoAsset:          0x...
PaymentLedger:      0x...
SustainabilityNFT:  0x...
CoconutRegistry:    0x...
BriquetteMarket:    0x...
CoinconutPaymaster: 0x...
```

Cole cada endereço gerado no seu arquivo `.env`:
```env
COCO_ASSET_ADDRESS=0x...
PAYMENT_LEDGER_ADDRESS=0x...
REGISTRY_ADDRESS=0x...
SUSTAINABILITY_NFT_ADDRESS=0x...
MARKET_ADDRESS=0x...
PAYMASTER_ADDRESS=0x...
```

#### 3. Depois do deploy (Ações manuais no terminal)

Essas ações não vão para o `.env`, mas precisam ser feitas antes de usar o sistema. No console do Hardhat (`npx hardhat console --network sepolia`) ou via script:

**Conceder ORACLE_ROLE** 
É o endereço do serviço que vai confirmar os PIX. No MVP pode ser sua própria carteira para testar:
```javascript
await paymentLedger.grantRole(ORACLE_ROLE, "0x_endereço_do_oráculo")
await market.grantRole(ORACLE_ROLE, "0x_endereço_do_oráculo")
```

**Depositar ETH no Paymaster** 
Para que ele pague o gas dos fornecedores (Account Abstraction):
```javascript
await paymaster.deposit({ value: ethers.parseEther("0.1") })
```

#### Exemplo de `.env` final preenchido:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/abc123
PRIVATE_KEY=chave_privada_64_chars
ETHERSCAN_API_KEY=chave_etherscan

COCO_ASSET_ADDRESS=0x...
PAYMENT_LEDGER_ADDRESS=0x...
REGISTRY_ADDRESS=0x...
SUSTAINABILITY_NFT_ADDRESS=0x...
MARKET_ADDRESS=0x...
PAYMASTER_ADDRESS=0x...
```

### 💻 Compilar contratos e rodar o frontend

```bash
# Compilar smart contracts (Hardhat)
npx hardhat compile

# Rodar frontend em desenvolvimento
cd frontend
bun run dev   # ou npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build de produção do frontend

```bash
cd frontend
bun run build
bun run preview
```

### Deploy na Vercel

O projeto já está configurado para deploy automático na Vercel.

**Configuração do projeto na Vercel:**

| Campo | Valor |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `bun run build` |
| Output Directory | `dist` |

## 📁 Estrutura do Monorepo

```
coinconut/
├── frontend/          ← Aplicação web (este README)
│   ├── src/
│   │   ├── assets/        Imagens
│   │   ├── components/    Nav, Footer, UI (Radix)
│   │   ├── routes/        Páginas (TanStack Router)
│   │   └── styles.css     Design system
│   ├── vercel.json        Rewrite SPA
│   └── vite.config.ts     Build config
├── contracts/         ← Smart Contracts (Solidity)
├── scripts/           ← Scripts de deploy
├── test/              ← Testes de contrato
├── docs/              ← Documentação técnica
└── assets/            ← Assets compartilhados
```

## 👥 Equipe

| Membro | Foco |
|---|---|
| <img src="https://github.com/josiasdev.png" width="50" style="border-radius:50%"/><br/>**[Josias](https://github.com/josiasdev)** | Frontend · UX · Integração |
| <img src="https://github.com/davicorreia-dev.png" width="50" style="border-radius:50%"/><br/>**[Davi](https://github.com/davicorreia-dev)** | Smart Contracts · Solidity · Deploy |
| <img src="https://github.com/JadeProg.png" width="50" style="border-radius:50%"/><br/>**[Jade](https://github.com/JadeProg)** | Pitch |
| <img src="https://github.com/willian-uiu.png" width="50" style="border-radius:50%"/><br/>**[Willian](https://github.com/willian-uiu)** | Pitch |


## 📄 Licença

MIT

---

<p align="center">
  <strong>COINCONUT</strong> Da casca ao pagamento, rastreado.<br/>
  Hackathon Web3 RESTIC 29 ImpactLedger · 2026
</p>
