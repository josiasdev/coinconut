[Leia em Português](README_PT_BR.md)

# COINCONUT — ImpactLedger on Stellar
<img src="docs/images/hero.jpg" alt="COINCONUT Banner" style="width: 100%; border-radius: 12px; margin-bottom: 20px;" />

## About the Project
Official project submitted to the **PULSO Hackathon** (Stellar Network). **COINCONUT** was entirely migrated and architected to run natively on the Stellar Blockchain, utilizing **Soroban** for Smart Contracts and native network functionalities for seamless adoption.

## Objective
To build a blockchain-based solution capable of registering, validating, and certifying social and environmental impact actions. **COINCONUT** achieves this by certifying the entire reverse logistics and recycling of coconut husks, which represent a massive environmental liability in northeastern Brazil.

## The Problem and Solution

### The Problem
The improper disposal of coconut husks, which make up **80% of the fruit's total weight**, causes severe environmental and logistical problems. This supply chain currently suffers from three major bottlenecks:
- **Inefficient Public Systems:** Municipal selective collection frequently fails or doesn't exist, shifting the burden to disorganized, low-income rural collectors.
- **Social Vulnerability:** These workers operate invisibly, suffering from a lack of transparency and chronic payment delays from intermediaries.
- **Industrial Greenwashing:** ESG-focused industries face serious difficulties tracing and proving their sustainable practices from end to end in a truly auditable manner.

### The Solution (Powered by Stellar)
We developed a **decentralized Web3 infrastructure** on Stellar that transforms waste into measurable socio-environmental impact, structured on three pillars:
- **On-Chain Traceability (Soroban):** Weighing the coconut husk generates an immutable, auditable record directly on our Rust-based Soroban Smart Contract (`CoinconutContract`).
- **Supply Chain Privacy with ZK (Noir):** Industries often refuse to expose their exact processing volume or specific suppliers to competitors. Using a Zero-Knowledge circuit written in **Noir**, the industry generates an off-chain proof that they processed `> X kg` of waste. The Soroban contract (`issue_cert_zk`) mathematically verifies this proof, issuing the ESG certificate while keeping the exact processed amount and supplier identity completely hidden from the public ledger.
- **ESG Certificate:** When the industry processes the acquired raw material, the Soroban Smart Contract issues an immutable Sustainability Certificate (Soulbound) that attests to the company's real ecological practice, serving as anti-greenwashing ESG proof.
- **Instant Fiat Settlement (Stellar Anchors / Fee Bumps):** To ensure producers don't have to deal with complex network fees, the industry uses **Fee Bumps** to cover transaction costs (via Freighter). The final payment settlement (off-ramp) is automated (PIX) via Stellar Anchors (SEP-24).

## Links and Demonstration

**Application Link:** [coinconut-b6qp.vercel.app](https://coinconut-b6qp.vercel.app)

**Demo Video:** [Watch our Demo on YouTube](https://youtu.be/LGsvX2m00U8)

**Functional Demonstration:** 
The main flow is orchestrated through 3 frontend portals:
1. **Collection Hub:** Weighs the husk, signs the transaction, and interacts with the contract on Testnet to register the Batch.
2. **Industry:** Acquires the tracked batch on the dashboard and triggers the advance stage and ESG emission functions (On-Chain Certificate) in Soroban.
3. **Collector (Producer):** Accesses their Dashboard to see their validated deliveries on the Stellar network and performs the conversion (off-ramp) via a simulated SEP-24 (PIX Oracle).

**Soroban Smart Contract (Stellar Testnet):**
- **CoinconutCore (Batch and ESG Management):** `CCIJZTJJBPU3CHI3235FR7SY22F5IOYQJOV3WAYNB3OY3MQ7TOI4AA3P`
- View transactions on [Stellar Expert Testnet](https://stellar.expert/explorer/testnet/contract/CCIJZTJJBPU3CHI3235FR7SY22F5IOYQJOV3WAYNB3OY3MQ7TOI4AA3P)

---

## Application Examples
- Anti-fraud ESG impact certification for coconut substrate and fiber factories (e.g., Industries in Ceará).
- Traceability record of impact and recycling (Reverse Logistics).
- Fair and instant remuneration for small producers through Stellar's Fiat-to-Crypto ecosystem.

## Technologies Used
- **Smart Contracts:** Rust, Soroban SDK, Stellar CLI.
- **Network:** Stellar Testnet.
- **Frontend Web3:** React 19, TypeScript, Vite, `@stellar/stellar-sdk`, `@stellar/freighter-api`.
- **Design:** Tailwind CSS v4, Framer Motion, TanStack Router.

## Repository Structure
- `/soroban-contracts/contracts/coinconut`: Centralized Smart Contract source code in Rust.
- `/frontend`: Web SPA natively connected to the Freighter Wallet and Stellar RPC.
- `/docs`: Documentation, including market validation (Customer Discovery in `CUSTOMER_DISCOVERY.md`).

## How to Run Locally

### 1. Backend (Soroban Smart Contract)
Ensure you have Rust, Stellar CLI, and the `wasm32-unknown-unknown` target installed.
```bash
cd soroban-contracts/contracts/coinconut

# To run unit tests for the entire ESG and traceability cycle:
make test

# To compile the production WASM file:
make build
```

### 2. Web Frontend
```bash
# Access the frontend folder and install dependencies
cd frontend
npm install

# Run the application (Integrated with Freighter wallet)
npm run dev
```

## PULSO Hackathon Minimum Requirements Met
- **Solution built on Stellar:** Yes (Soroban `CoinconutContract`).
- **Real problem:** Yes (Dealing with 80% coconut waste and lack of ESG transparency).
- **Challenge Alignment:** Perfect fit for the "ImpactLedger/Sustainability" Track.
- **Account Abstraction / Fee Bumps:** Frontend conceptually modeled and prepared (`config.ts`) to subsidize costs for rural producers.
- **Pitch Video:** Yes (Loom link above).

## Team
- **[Josias](https://github.com/josiasdev)** | Frontend · UX · Web3 Integration 
- **[Davi](https://github.com/davicorreia-dev)** | Smart Contracts · Soroban/Rust · Deploy 
- **[Jade](https://github.com/JadeProg)** | Pitch & Business Validation
- **[Willian](https://github.com/willian-uiu)** | Pitch & ESG Use Cases
