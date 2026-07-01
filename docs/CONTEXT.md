# COINCONUT — Guia de Contexto para Desenvolvedores (CONTEXT.md)

Este documento foi criado para ajudar novos desenvolvedores a entenderem a arquitetura, o fluxo de negócios e as tecnologias por trás do COINCONUT em seu estado final de MVP para o PULSO Hackathon (Stellar).

---

## Visão Geral da Arquitetura

O COINCONUT é um DApp (Decentralized Application) focado na rastreabilidade e monetização da reciclagem da casca do coco. Ele une um **Frontend em React 19 (Vite)** com um **Smart Contract construído em Rust (Soroban) na rede Stellar Testnet**.

A plataforma não foca apenas na rastreabilidade, mas também na **inclusão financeira e recompensa ESG**. Produtores rurais (catadores) são pagos por resíduos que antes eram descartados, de forma protegida de taxas de rede via **Fee Bumps**, enquanto indústrias recebem Certificados ESG inalteráveis na blockchain Stellar.

---

## O Smart Contract (Soroban / Rust)

A antiga suíte de contratos EVM foi refatorada e consolidada em um único e poderoso contrato na arquitetura Soroban: o `CoinconutContract` (`lib.rs`).

### Mecânicas Principais
- **`create_batch`:** Ponto de entrada da logística. Cadastra o peso físico coletado atrelado à carteira do produtor rural.
- **`advance_stage` / `finalize_as_adubo`:** Funções de transformação utilizadas pelas indústrias para processar a casca em biomassa ou briquetes.
- **`issue_cert`:** O grande diferencial para o B2B. Cunhagem e registro do Certificado ESG on-chain e intransferível.
- **`issue_cert_zk`:** Integração com provas Zero-Knowledge usando Noir. Permite a emissão do Selo ESG corporativo sem expor os volumes de Supply Chain da indústria na rede pública.

---

## O Frontend (Vite + React)

O Frontend usa a estratégia de "Portais", isolando a experiência por tipo de usuário: Catador, Ponto de Coleta e Indústria. Totalmente integrado com a API da **Freighter Wallet**.

### Estrutura de Pastas e Rotas
- **`src/routes/__root.tsx`**: Rota base e layout (Nav, Footer).
- **`src/routes/dashboard.tsx`**: Portal do Catador (Produtor). Exibe os lotes certificados gerados na rede Stellar.
- **`src/routes/coleta.tsx`**: Tela do Ponto de Coleta (Quiosque). Pesa o material, assina no Freighter e aciona `create_batch` nativamente.
- **`src/routes/registrar.tsx`**: Tela da Indústria. Sincroniza lotes novos, faz o processamento (`advance_stage`) e garante o Selo ESG. 
- **`src/routes/esg.tsx`**: **Fator UAU!** Uma galeria visual premium que lista os certificados de sustentabilidade on-chain atrelados ao endereço da indústria.
- **`src/routes/saque.tsx`**: Tela do Produtor onde o off-ramp fiduciário acontece, demonstrando o uso de SEP-24 / Âncoras Stellar para transformação de saldos digitais em PIX no mundo real.

---

## O Fluxo de Apresentação (Pitch / "Happy Path")

Para testar toda a plataforma end-to-end (utilizando o Freighter na rede Testnet), siga este fluxo:

1. **Agente (A Coleta):** Acesse a rota `/coleta`. Conecte o Freighter. Digite o peso do material, verifique as métricas de qualidade e confirme. A transação Soroban assinará a emissão do lote!
2. **Fábrica (O Processamento):** Acesse a rota `/registrar`. Conecte o Freighter (pode ser outra conta, simulando a Indústria). O sistema sincronizará o lote pendente. Confirme a compra do material para gerar o **Selo ESG**.
3. **Galeria ESG:** Clique no atalho para a "Galeria ESG" (`/esg`) e visualize a conquista registrada permanentemente na rede Stellar, rendendo a prova de sustentabilidade contra o greenwashing.
4. **Produtor (Saque Off-ramp):** Acesse a rota `/saque`. Simule o uso do SEP-24 da Stellar para sacar instantaneamente o saldo validado no painel da Blockchain direto para a chave PIX do usuário!

---

## Scripts e Ambiente Local

Para compilar, testar e publicar seu contrato na Testnet usando o Stellar CLI:
```bash
# Na pasta do contrato
cd soroban-contracts/contracts/coinconut

# Rodar a bateria de testes unitários em Rust:
make test

# Compilar o arquivo WASM para deploy:
make build
```

**Desenvolvido para o PULSO Hackathon da rede Stellar. 💚🥥**
