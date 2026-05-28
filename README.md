# 🥥 COINCONUT — ImpactLedger: Transformando Casca de Coco em Impacto Verificável

> **Projeto submetido ao Hackathon Web3 RESTIC 29 · Desafio ImpactLedger**

A **COINCONUT** é uma infraestrutura descentralizada desenvolvida para registrar, auditar e certificar ações de impacto ambiental e social. Nós conectamos **produtores rurais (catadores)**, **postos de coleta** e **fábricas de transformação** em uma cadeia de suprimentos 100% rastreável, transformando o descarte irregular da casca de coco em um negócio transparente, com remuneração instantânea (PIX) e custo zero para a base da pirâmide.

---

## 🌍 1. O Problema: Descarte Invisível e Trabalho Informal

O Ceará é o 2º maior produtor de coco em área plantada do Brasil, mas a cadeia de reciclagem da casca (que representa ~85% do peso do fruto) sofre de falhas estruturais crônicas:
- **Descarte irregular:** A maior parte vai para aterros ou lixões, poluindo e desperdiçando matéria-prima.
- **Trabalho invisível:** Catadores e pequenos produtores recolhem a casca informalmente e sofrem com atrasos ou falta de transparência nos pagamentos.
- **Falta de evidências auditáveis:** As fábricas que compram a casca não conseguem comprovar a origem sustentável do material (greenwashing vs. impacto real).

Como garantir que a logística reversa da casca do coco seja auditável e que o dinheiro realmente chegue às mãos do catador na base da cadeia?

---

## 💡 2. A Solução: Rastreabilidade e Transparência On-Chain

A **COINCONUT** utiliza a tecnologia Blockchain e Smart Contracts não apenas para guardar informações, mas para **automatizar a confiança** entre partes que não se conhecem.

Nós criamos 3 portais independentes na nossa plataforma:
1. **👨‍🌾 O Catador (Dashboard):** Um painel onde o pequeno produtor vê suas entregas certificadas e recebe seu pagamento em Reais na mesma hora.
2. **📍 O Ponto de Coleta (Quiosque):** Um sistema operado por cooperativas locais que pesa o coco e emite o registro imutável do lote.
3. **🏭 A Indústria (Compra e Transformação):** O portal da fábrica, que adquire a matéria-prima rastreada e a transforma em produtos ecológicos (Briquetes, Fibra, Substrato).

**Por que Blockchain?**
- **Evidências Imutáveis:** Cada pesagem gera um *batch* tokenizado (ERC-1155), garantindo que 1kg de casca registrada não seja duplicado na rede.
- **Contratos Auto-Executáveis:** Quando a Indústria finaliza a compra, o Smart Contract de pagamento libera a autorização do PIX direto para o Catador. Sem intermediários, sem atrasos.
- **Certificação Instantânea:** Ao transformar a casca em produto final, a rede emite um **Selo ESG em formato de NFT Soulbound (ERC-721)**, provando permanentemente ao mercado comprador o impacto gerado.

---

## ⚙️ 3. Funcionamento e Fluxo da Plataforma

A plataforma foi construída focando na usabilidade (UX). **O usuário final não precisa entender de Web3 para gerar impacto.**

### Fluxo de Registro de Impacto:
1. **Coleta e Evidência:** O Catador leva 80kg de casca até o Ponto de Coleta. O Agente acessa sua área autenticada (`/coleta`), valida as evidências físicas (casca seca e limpa) e assina a transação.
2. **Registro On-Chain:** A transação gera um lote (Batch ID) no contrato `CoconutRegistry` atrelado à carteira do Ponto de Coleta. O impacto já existe e é público.
3. **Compra e Transformação:** A fábrica acessa sua área (`/registrar`), localiza o produtor e transforma o Batch em "Briquete Ecológico". 
4. **Liquidação e Certificação:** O contrato debita o saldo patrocinado, envia via integração oracular o PIX ao catador, e cunha o NFT de Sustentabilidade para a Indústria.

> **Transparência em Tempo Real:** Qualquer cidadão, ONG ou governo pode acessar o portal público **`/transparencia`** para visualizar o total de Kg reciclados e a renda distribuída. O explorador lê diretamente dos contratos na rede Sepolia, dispensando banco de dados centralizado.

---

## 🏗️ 4. Arquitetura e Tecnologias Utilizadas

A aplicação foi desenhada com uma separação clara entre a camada visual e a camada de consenso descentralizado.

### 💻 Stack Frontend
- **Framework:** React 19 + TypeScript + Vite (SPA rápida e reativa).
- **Roteamento:** TanStack Router (rotas isoladas para cada perfil de usuário).
- **Estilização e Animações:** Tailwind CSS v4 + Framer Motion (micro-interações premium).
- **Integração Web3:** Ethers.js v6.

### ⛓️ Stack Smart Contracts (Solidity)
A lógica de negócios e as regras de liquidação vivem inteiramente na rede blockchain Sepolia Testnet.

| Contrato | Padrão | Função no Ecossistema |
|---|---|---|
| **CocoAsset** | `ERC-1155` | Representa fisicamente os lotes. Acompanha os estágios (Recebido -> Moído -> Adubo/Briquete). |
| **CoconutRegistry** | `Custom` | Coração logístico. Cadastra Postos de Coleta, registra entregas, emite os tokens e vincula PIX. |
| **PaymentLedger** | `Custom` | Oráculo de pagamentos. Segura a obrigação financeira (`PENDING`, `PAID`) até a compensação fiduciária. |
| **BriquetteMarket**| `Custom` | Mercado final (B2B). Onde a indústria "compra" o lote e lista para venda externa. |
| **SustainabilityNFT**| `ERC-721` | Selo ESG intransferível (Soulbound) emitido na conversão final do resíduo em produto ecológico. |
| **Paymaster** | `ERC-4337` | Cofre de gás patrocinado. Garante que as taxas da rede (Gas Fees) sejam subsidiadas, zerando o custo para o produtor e pontos de coleta. |

### 🔗 Smart Contracts Deployados (Sepolia Testnet)

| Contrato | Endereço | Link Etherscan |
|---|---|---|
| **CocoAsset** | `0x9613...2bcb` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x961379292204ED01DC6436dC2db666f5E9532bCb) |
| **CoconutRegistry** | `0xF6f3...2E70` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70) |
| **PaymentLedger** | `0x80d9...Ed64` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x80d9A97CEE8F8530888879d09fc1010082aFEd64) |
| **BriquetteMarket** | `0xFFd4...DA8e` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e) |
| **SustainabilityNFT** | `0x6C3a...4619` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619) |
| **CoinconutPaymaster**| `0x0911...72bA` | [Ver na Sepolia](https://sepolia.etherscan.io/address/0x09111165AC75767E23926bfAA56C884bCD1172bA) |

---

## 🚀 5. Instruções de Execução (Rodando o Projeto Localmente)

### Pré-requisitos
- Node.js (v18+)
- Conta no MetaMask configurada na rede Sepolia Testnet.

### Passo 1: Instalar dependências globais
```bash
# Na raiz do projeto, instale as dependências dos contratos Hardhat
npm install

# Acesse a pasta do frontend e instale as dependências do React
cd frontend
npm install
```

### Passo 2: Executar o Frontend
O projeto já aponta para os contratos implantados na rede pública Sepolia. Não é necessário realizar deploy local para avaliar a plataforma.
```bash
# Dentro da pasta frontend
npm run dev
```
Acesse `http://localhost:5173/` no seu navegador.

### Passo 3: Testando os Fluxos
Para replicar os testes apresentados no vídeo de demonstração:
1. Conecte sua MetaMask na rede **Sepolia Testnet**.
2. Acesse o **Posto de Coleta** via Home Page e registre uma entrega. Confirme a transação na sua carteira.
3. Acesse a **Indústria**, localize a entrega no produtor teste e registre a conversão para Briquete.
4. Confira o link do Etherscan gerado na notificação de sucesso e veja a mágica acontecendo on-chain!

---
*Transformando resíduo em ativos rastreáveis.* 🥥♻️
