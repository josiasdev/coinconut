# 🥥 COINCONUT — Cadeia da Casca de Coco, Rastreada

> **Hackathon Web3 RESTIC 29 · Desafio ImpactLedger**

Plataforma que conecta **produtores rurais**, **postos de coleta** e **fábricas de briquetes** em uma cadeia de suprimentos transparente — com pagamento via PIX, rastreabilidade total e custo zero para o produtor.

---

## 🌍 O Problema

O coco é uma das culturas mais importantes do agronegócio brasileiro. Em 2021, a produção mundial foi de 63 milhões de toneladas, com o **Brasil sendo o 5º maior produtor** (4,5% do total). O Nordeste concentra 81% da área plantada, e **o Ceará é o 2º maior produtor em área plantada** no país.

A casca representa ~85% do peso do fruto. Com a magnitude desses números, o descarte inadequado cria um **problema ambiental gigantesco**, com grande parte do resíduo parando em aterros sanitários e lixões urbanos.

A cadeia atual de reciclagem dessa casca sofre de:

- **Pagamentos atrasados e informais** para produtores rurais
- **Sem rastreabilidade**: impossível provar a origem sustentável da matéria-prima
- **Desconfiança**: produtores não sabem quanto vão receber ou quando
- **Impacto invisível**: sem dados auditáveis de sustentabilidade

## 🏭 Case Real: Brasil Eco Fibras

Este MVP foi modelado para atender empresas inovadoras como a **Brasil Eco Fibras**, localizada em Pindoretama, na região metropolitana de Fortaleza (CE). A empresa:
- Coleta resíduos de vizinhos e emprega mão-de-obra local.
- Converte a casca de coco seco em **Fibra**, **Pó/Substrato**, **Chip** e briquetes.
- Substitui matérias-primas poluentes (como plásticos) por fibras naturais em aplicações na agricultura, jardinagem e indústria.

O COINCONUT atua fornecendo a infraestrutura financeira e logística para que essa coleta seja transparente e eficiente.

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

### Dados mockados

O frontend usa dados simulados realistas para demonstração:

- **Produtores**: Maria das Graças (Pindoretama-CE), João Batista (Cascavel-CE), Francisca Lima (Aquiraz-CE)
- **Valores**: Dinâmicos conforme o produto de destino (Fibra: R$ 3,20/kg · Pó: R$ 1,80/kg · Chip: R$ 2,50/kg)
- **Fábrica**: Brasil Eco Fibras (Estoque de matérias e produtos acabados)

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

### Compilar contratos e rodar o frontend

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
| **Co-founder** | Smart Contracts · Solidity · Deploy |

## 📄 Licença

MIT

---

<p align="center">
  <strong>COINCONUT</strong> Da casca ao pagamento, rastreado.<br/>
  Hackathon Web3 RESTIC 29 ImpactLedger · 2026
</p>
