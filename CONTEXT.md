# 🥥 COINCONUT — Guia de Contexto para Desenvolvedores (CONTEXT.md)

Este documento foi criado para ajudar novos desenvolvedores a entenderem a arquitetura, o fluxo de negócios e as tecnologias por trás do COINCONUT.

---

## 🏗️ Visão Geral da Arquitetura

O COINCONUT é um DApp (Decentralized Application) focado na rastreabilidade e monetização da reciclagem da casca do coco. Ele une um **Frontend em React (Vite)** com uma suíte de **Smart Contracts na rede Ethereum (Testnet Sepolia)**.

A plataforma não foca apenas na rastreabilidade (onde o produto foi parar), mas também na **inclusão financeira**. Produtores rurais são pagos por resíduos que antes eram descartados, e fábricas compram matéria-prima com origem 100% garantida na Blockchain.

---

## 📜 Os Smart Contracts

Todo o fluxo lógico da cadeia é controlado por um ecossistema de contratos construídos com Solidity e testados via Hardhat. Eles interagem entre si em diferentes etapas da reciclagem:

### 1. `CocoAsset.sol` (O Ativo Físico)
- **Padrão:** ERC-1155.
- **Função:** Representa a casca de coco em todos os seus estágios. Quando o coco é coletado, ele nasce no "Estágio 0" (Casca Bruta). Quando a fábrica o processa, ele "queima" o Estágio 0 e minta o "Estágio 1" (Fibra/Pó) e "Estágio 2" (Briquete).

### 2. `CoconutRegistry.sol` (O Orquestrador Logístico)
- **Função:** É o ponto de entrada principal para a logística.
- Quando um agente recolhe o coco, ele chama `registerDelivery`. Isso emite o ativo em `CocoAsset` para a custódia do Registry e cria uma promessa de pagamento em `PaymentLedger`.
- Tem funções vitais como `advanceBatchStage` e `finalizeBatchAsAdubo`.

### 3. `PaymentLedger.sol` (O Livro Razão Financeiro)
- **Função:** Desacopla o token criptográfico da moeda fiduciária.
- Como o produtor rural geralmente quer receber em Reais (BRL) via PIX e não em Tokens ERC-20, este contrato age como um "caderninho de fiado" on-chain.
- Ele registra um status `PENDING` no valor exato (em centavos de Real). Quando o PIX é processado off-chain, um Oráculo chama `confirmPayment` e altera o status para `PAID`, registrando o ID da transação PIX.

### 4. `BriquetteMarket.sol` (O Marketplace B2B)
- **Função:** Permite que a Fábrica coloque o produto processado à venda (`list()`).
- Empresas finais podem comprar esses produtos (`buy()`). Ao comprarem, ganham não só a posse da matéria prima, mas recebem um NFT de sustentabilidade.

### 5. `SustainabilityNFT.sol` (O Selo ESG)
- **Padrão:** ERC-721 "Soulbound" (Intransferível).
- **Função:** Recompensa empresas que compram o produto verde. Como é intransferível, serve como prova irrevogável de que a empresa investiu em logística reversa sustentável.

---

## 💻 O Frontend (Vite + React)

O Frontend foi desenhado para ocultar a complexidade da Blockchain do usuário final, mas sem abrir mão da segurança Web3. 

### Estrutura de Pastas e Rotas
- **`src/routes/__root.tsx`**: Template base com o layout de tela.
- **`src/routes/coleta.tsx`**: Tela do Agente de Coleta. É onde ocorre a chamada do `registerDelivery`.
- **`src/routes/registrar.tsx`**: Tela da Fábrica. Faz a "Sincronização" puxando os lotes do `CoconutRegistry`, chama `advanceBatchStage` e, em seguida, o `list` do Mercado.
- **`src/routes/saque.tsx`**: Tela do Produtor. Lê todos os pagamentos atrelados à carteira conectada que estejam como `PENDING` no `PaymentLedger`.
- **`src/routes/dashboard.tsx`**: Visão geral. O `ProdutorView` puxa o saldo e as últimas 5 transações diretamente da Blockchain.

### Como a Conexão Funciona (`useWeb3.ts`)
O arquivo `src/hooks/useWeb3.ts` expõe a conta, o `signer` e o provider Ethers.js.
O arquivo `src/lib/web3/config.ts` injeta os endereços corretos do `.env.local` e instancia os contratos usando as ABIs geradas na compilação.

---

## 🛣️ O Fluxo "Happy Path"

Para você testar toda a plataforma end-to-end, siga este fluxo:

1. **Agente (A Coleta):** Acesse a rota `/coleta`. Conecte o MetaMask e selecione o "Meu Produtor (Teste)". Cadastre uma pesagem de 100kg. Aprova no MetaMask. A rede criará um `Lote` no Registry.
2. **Fábrica (O Processamento):** Acesse `/registrar`. Selecione novamente o "Meu Produtor" e clique em "Sincronizar rede". O sistema puxará o Lote recém criado. Confirme o processamento e aprove no MetaMask.
3. **Produtor (O Recebimento):** Acesse `/saque`. Se você conectar a mesma carteira, o sistema calculará o preço total dos lotes que você entregou que ainda constam como PENDENTES no `PaymentLedger` e exibirá o saldo real de BRL na tela.

---

## 🔧 Scripts de Configuração Rápida

Se você fez um deploy recente e precisa rodar configurações iniciais (como conceder Roles e cadastrar Postos de Coleta), utilize:
```bash
npx hardhat run scripts/setup.js --network sepolia
```

Para chegar rapidamente o saldo de ETH da sua conta deployer e confirmar se tem Gas suficiente:
```bash
npx hardhat run scripts/checkBalance.js --network sepolia
```

**Desenvolvido com 💚 para um Brasil mais limpo.**
