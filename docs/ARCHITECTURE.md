# Arquitetura do COINCONUT (Versão Stellar)

Este documento descreve a topologia e as decisões arquiteturais do projeto **COINCONUT**, submetido ao PULSO Hackathon da rede Stellar.

## 1. Visão Geral

O COINCONUT adota uma arquitetura descentralizada (DApp) com separação estrita de responsabilidades:
- **Camada de Consenso e Negócios (Blockchain):** Smart Contract desenvolvido em Rust utilizando o Soroban SDK na rede Stellar (Testnet).
- **Camada de Apresentação e Interação (Frontend):** Single Page Application construída com React 19 e Vite, conectada via `@stellar/freighter-api`.
- **Camada de Liquidação Fiduciária:** Projetada para integração com Âncoras Stellar (SEP-24) para viabilizar conversão FIAT (PIX) instantânea no off-ramp.

---

## 2. Diagrama Lógico de Atores

A plataforma é dividida em "Portais" (Views), garantindo que cada participante interaja apenas com a sua responsabilidade na cadeia logística.

### A. Produtor / Catador (O Início da Cadeia)
- Interação protegida de atritos com taxas. O acesso utiliza **Fee Bumps** da rede Stellar, onde a indústria ou plataforma patrocina a taxa da transação (`fee`).
- Visualiza suas entregas validadas (Registros on-chain).
- Solicita o saque do valor em moeda fiduciária (BRL) via simulação de off-ramp nas Âncoras Stellar.

### B. Ponto de Coleta / Ecoponto (O Validador Logístico)
- Acesso nativo integrado à carteira Freighter.
- Funciona como oráculo humano e primeiro ponto de validação física da matéria-prima.
- Pesa o material e chama a função `create_batch` do Smart Contract.

### C. Indústria / Fábrica (A Transformação)
- Sincroniza os lotes recebidos e confirmados pelos ecopontos.
- Avança o estágio do lote (`advance_stage`), atestando a transformação física (ex: Casca para Fibra ou Briquete).
- Finaliza o ciclo e recebe a certificação ESG (`issue_cert`), atrelando os atributos ambientais (Soulbound) à sua conta na rede Stellar.

---

## 3. Modelo de Dados Descentralizado (Soroban)

A complexidade de múltiplos contratos EVM foi consolidada em um único contrato Soroban altamente otimizado (`CoinconutCore`).

### Ativos Físicos (Batches)
O estado `Batch` acompanha o produto físico:
1. **Estágio 0:** Casca Recebida (Coletada).
2. **Estágio 1:** Processada (Fibra/Chip).
3. **Estágio 2:** Produto Finalizado (Briquete/Adubo).

### Ativos Intangíveis (Obrigações e Certificados ESG)
- **Liquidação Fiduciária (Off-ramp):** O registro on-chain valida o peso e cria os parâmetros para que o Frontend, via SEP-24 (Âncoras Stellar), realize o saque instantâneo para PIX, protegendo o catador da volatilidade das criptomoedas.
- **Selo ImpactLedger (Certificado ESG):** Registrado permanentemente no contrato via `DataKey::Certificate`. É atrelado publicamente ao endereço do comprador (indústria) com garantias criptográficas antifraude (intransferível), prevenindo o comércio secundário de reputação climática (Greenwashing).

---

## 4. Tecnologias Empregadas

- **Linguagem de Smart Contracts:** Rust
- **Framework de Blockchain:** Soroban SDK & Stellar CLI
- **Integração Web3 Frontend:** `@stellar/stellar-sdk` e `@stellar/freighter-api`
- **Frontend SPA:** React 19 + TypeScript + Vite
- **Roteamento Frontend:** TanStack Router (Typesafe)
- **Design System:** Tailwind CSS v4 + Framer Motion
- **Notificações:** Sonner (Toasts)

## 5. Próximos Passos (Evolução Pós-Hackathon)
- Integração plena e em produção com um provedor de SEP-24 (Âncora BRL) para automatizar o envio de PIX via transferência de USDc/BRLT.
- Implementação de um serviço Backend (`Sponsor`) para assinar as `FeeBumpTransactions` sem depender exclusivamente de extensões de navegador nos dispositivos móveis dos catadores.
