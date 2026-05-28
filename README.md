# 🥥 COINCONUT — ImpactLedger

## Sobre o desafio
Projeto oficial submetido ao desafio **ImpactLedger** do Hackathon Web3 RESTIC 29.

## Objetivo
Construir uma solução baseada em blockchain capaz de registrar, validar e certificar ações de impacto social e ambiental. A **COINCONUT** alcança isso certificando toda a logística reversa e a reciclagem da casca do coco.

## O Problema e a Solução
- **O Problema:** O descarte irregular da casca do coco (que representa 85% do peso do fruto) gera poluição ambiental. Além disso, a coleta é feita de forma invisível por catadores que sofrem com a falta de transparência e atrasos nos pagamentos, enquanto indústrias lutam para comprovar suas práticas ESG sem cair no greenwashing.
- **A Solução:** Uma infraestrutura Web3 descentralizada onde a pesagem da casca gera um registro on-chain auditável. Quando a Indústria adquire a casca para transformação, os Smart Contracts emitem automaticamente um **Selo ESG em NFT (Soulbound)** para a fábrica e liberam o pagamento instantâneo via integração com Oráculo PIX para o catador.

## Links e Demonstração

**Link da aplicação:** [https://coinconut-b6qp.vercel.app](https://coinconut-b6qp.vercel.app)

**Demonstração funcional:** 
O fluxo principal é orquestrado através de 3 portais:
1. **📍 Posto de Coleta:** Pesa a casca e assina a transação, emitindo o registro imutável do lote e transferindo a custódia.
2. **🏭 Indústria:** Adquire a matéria-prima rastreada no painel e a converte em produtos ecológicos (Briquete, Fibra).
3. **👨‍🌾 Catador:** Acessa seu Dashboard para ver suas entregas validadas e sacar a sua remuneração de forma instantânea via simulador de Oráculo PIX.

**Demonstração auditável:** 
- A cada pesagem, um lote tokenizado (`ERC-1155`) é gerado no contrato `CocoAsset`.
- A cada transformação feita pela Indústria, o contrato emite um certificado intransferível (`ERC-721`) que fica guardado permanentemente na Galeria ESG.
- **Vídeo Demo / Pitch:** *(Inserir Link do YouTube aqui)*

**Smart Contracts Deployados (Sepolia Testnet):**
- **CocoAsset (Lotes ERC-1155):** [0x961379292204ED01DC6436dC2db666f5E9532bCb](https://sepolia.etherscan.io/address/0x961379292204ED01DC6436dC2db666f5E9532bCb)
- **CoconutRegistry (Logística):** [0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70](https://sepolia.etherscan.io/address/0xF6f39040a3dA724E466Eb31f9Da0EBc8Fc552E70)
- **PaymentLedger (Oráculo PIX):** [0x80d9A97CEE8F8530888879d09fc1010082aFEd64](https://sepolia.etherscan.io/address/0x80d9A97CEE8F8530888879d09fc1010082aFEd64)
- **BriquetteMarket (B2B):** [0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e](https://sepolia.etherscan.io/address/0xFFd48Fd40f6C3c734a384d1f7FB2581185AaDA8e)
- **SustainabilityNFT (Selo ESG ERC-721):** [0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619](https://sepolia.etherscan.io/address/0x6C3aa917f8C10C3608cb0dA877eb3F4eE6284619)

## Exemplos de aplicação no projeto
- Certificação de impacto ESG para fábricas.
- Registro de rastreabilidade de impacto e reciclagem (Logística Reversa).
- Remuneração justa e instantânea para pequenos produtores (Web3 + Fiat).
- Dashboard de Transparência auditável pelo governo ou ONGs.

## Tecnologias utilizadas
- **Smart Contracts:** Solidity, Hardhat, OpenZeppelin.
- **Rede:** Sepolia Testnet.
- **Frontend Web3:** Ethers.js, React 19, TypeScript, Vite.
- **Design:** Tailwind CSS v4, Framer Motion, TanStack Router.

## Estrutura do Repositório
- `/contracts`: Código-fonte dos Smart Contracts (CocoAsset, Registry, NFT, etc.)
- `/frontend`: Aplicação Web SPA e componentes de interface
- `/scripts`: Scripts automáticos de deploy e setup de permissões de rede
- `/test`: Bateria de testes de unidade (Chai/Mocha)

## Como executar

### Instalar dependências
```bash
# Na raiz, instale as dependências Hardhat
npm install

# Acesse a pasta do frontend e instale as dependências Web
cd frontend
npm install
```

### Compilar contratos
```bash
npx hardhat compile
```

### Deploy (Opcional - Já implantado)
```bash
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/setup.js --network sepolia
```

### Executar a Aplicação Web
```bash
cd frontend
npm run dev
```

## Requisitos mínimos
- **Uso de blockchain:** Sim (Todas as etapas são registradas na Sepolia).
- **Registro auditável:** Sim (Saldos, lotes e certificados NFTs são públicos no Etherscan).
- **Smart contract funcional:** Sim (Suíte de 6 contratos interligados).
- **Histórico verificável:** Sim (Página `/transparencia` sem banco de dados backend).
- **README funcional:** Sim.
- **Vídeo-pitch:** Pendente de inclusão do link.

## Equipe
- Josias (Full Stack & Web3 Developer)
- *(Adicione os demais membros aqui)*
