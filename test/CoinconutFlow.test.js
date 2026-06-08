const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("COINCONUT Core Workflow - Hackathon MVP", function () {
  let cocoAsset, registry, paymentLedger, market, nft, paymaster;
  let deployer, collector, industry, b2bBuyer, producer;
  let FACTORY_ROLE, OPERATOR_ROLE, ORACLE_ROLE, MINTER_ROLE;

  before(async function () {
    [deployer, collector, industry, b2bBuyer, producer] = await ethers.getSigners();

    FACTORY_ROLE = ethers.keccak256(ethers.toUtf8Bytes("FACTORY_ROLE"));
    OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));
    ORACLE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ORACLE_ROLE"));
    MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

    // 1. Deploy Contracts
    const CocoAsset = await ethers.getContractFactory("CocoAsset");
    cocoAsset = await CocoAsset.deploy();

    const PaymentLedger = await ethers.getContractFactory("PaymentLedger");
    paymentLedger = await PaymentLedger.deploy();

    const CoconutRegistry = await ethers.getContractFactory("CoconutRegistry");
    registry = await CoconutRegistry.deploy(await cocoAsset.getAddress(), await paymentLedger.getAddress(), 30);

    const SustainabilityNFT = await ethers.getContractFactory("SustainabilityNFT");
    nft = await SustainabilityNFT.deploy();

    const BriquetteMarket = await ethers.getContractFactory("BriquetteMarket");
    market = await BriquetteMarket.deploy(await nft.getAddress(), await paymentLedger.getAddress());

    const Paymaster = await ethers.getContractFactory("CoinconutPaymaster");
    paymaster = await Paymaster.deploy(deployer.address, await registry.getAddress(), deployer.address);

    // 2. Setup Roles
    await cocoAsset.grantRole(FACTORY_ROLE, await registry.getAddress());
    
    await paymentLedger.grantRole(OPERATOR_ROLE, await registry.getAddress());
    await paymentLedger.grantRole(OPERATOR_ROLE, await market.getAddress());
    await paymentLedger.grantRole(ORACLE_ROLE, deployer.address);
    
    await nft.grantRole(MINTER_ROLE, await market.getAddress());
    // Also grant MINTER_ROLE to industry for the UI Bypass feature we added
    await nft.grantRole(MINTER_ROLE, industry.address);
    
    await market.grantRole(FACTORY_ROLE, industry.address);
    await market.grantRole(ORACLE_ROLE, deployer.address);
    await registry.setOperator(industry.address, true); // Industry processes the batch

    // 3. Register Collection Point
    await registry.addCollectionPoint("Ponto Teste", collector.address);
    await registry.setOperator(collector.address, true); // Authorize collector Agent
  });

  it("Passo 1: Catador registra uma entrega e gera obrigação de pagamento (PIX Pendente)", async function () {
    const weightGrams = 50000; // 50kg
    const pixKey = "producer@pix.com";

    const tx = await registry.connect(collector).registerDelivery(
      producer.address,
      1, // collectionPointId
      weightGrams,
      pixKey
    );
    await tx.wait();

    // Verificações
    const delivery = await registry.deliveries(1);
    expect(delivery.supplier).to.equal(producer.address);
    expect(delivery.weightGrams).to.equal(weightGrams);
    
    // Ledger
    const paymentId = delivery.paymentId;
    const payment = await paymentLedger.payments(paymentId);
    expect(payment.supplier).to.equal(producer.address);
    expect(payment.amountCents).to.be.gt(0); 
    expect(payment.status).to.equal(0); // 0 = PENDING
  });

  it("Passo 2: Oráculo PIX simula a transferência para o Catador e confirma pagamento", async function () {
    const paymentId = 1; 

    await paymentLedger.connect(deployer).confirmPayment(paymentId, "TX-PIX-XYZ123");

    const payment = await paymentLedger.payments(paymentId);
    expect(payment.status).to.equal(1); // 1 = PAID
    expect(payment.pixProof).to.equal("TX-PIX-XYZ123");
  });

  it("Passo 3: Indústria (Fábrica) processa a casca de coco em Fibra/Briquete", async function () {
    const batchId = 1; 
    
    const tx = await registry.connect(industry).advanceBatchStage(batchId);
    await tx.wait();

    const batch = await cocoAsset.batches(batchId);
    expect(batch.stage).to.equal(1); // 1 = PROCESSED
  });

  it("Passo 4: Indústria lista o produto e emite o Selo de Sustentabilidade (NFT Soulbound)", async function () {
    const batchId = 1;
    const weightGrams = 50000;
    const priceCents = 150; 
    
    // Indústria lista o lote processado
    const tx = await market.connect(industry).list(batchId, weightGrams, priceCents, false);
    await tx.wait();

    const listing = await market.listings(1);
    expect(listing.batchId).to.equal(batchId);
    expect(listing.sold).to.be.false;

    // Fator UAU: No frontend fazemos o bypass e emitimos o NFT direto para a indústria
    const txNft = await nft.connect(industry).issue(industry.address, batchId, weightGrams, "Selo ESG - Fibra");
    await txNft.wait();

    const nftBalance = await nft.balanceOf(industry.address);
    expect(nftBalance).to.equal(1);
    
    const cert = await nft.certificates(1);
    expect(cert.buyer).to.equal(industry.address);
    expect(cert.productType).to.equal("Selo ESG - Fibra");
  });
});
