const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("COINCONUT Security & Edge Cases (Caminho Ruim)", function () {
  let cocoAsset, registry, paymentLedger, market, nft;
  let deployer, collector, industry, maliciousActor, producer;
  let FACTORY_ROLE, OPERATOR_ROLE, ORACLE_ROLE, MINTER_ROLE;

  before(async function () {
    [deployer, collector, industry, maliciousActor, producer] = await ethers.getSigners();

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

    // 2. Setup Roles
    await cocoAsset.grantRole(FACTORY_ROLE, await registry.getAddress());
    await paymentLedger.grantRole(OPERATOR_ROLE, await registry.getAddress());
    await paymentLedger.grantRole(OPERATOR_ROLE, await market.getAddress());
    await paymentLedger.grantRole(ORACLE_ROLE, deployer.address);
    await nft.grantRole(MINTER_ROLE, await market.getAddress());
    await market.grantRole(FACTORY_ROLE, industry.address);
    
    // Register proper collection point for tests that need it
    await registry.addCollectionPoint("Ponto Oficial", collector.address);
    await registry.setOperator(collector.address, true);
  });

  it("Não deve permitir que um ator malicioso registre uma entrega de coco", async function () {
    const weightGrams = 50000;
    
    await expect(
      registry.connect(maliciousActor).registerDelivery(
        producer.address,
        1, // collectionPointId
        weightGrams,
        "pix@malicioso.com"
      )
    ).to.be.revertedWith("Not authorized.");
  });

  it("Não deve permitir entrega com menos de 1kg (1000g)", async function () {
    await expect(
      registry.connect(collector).registerDelivery(
        producer.address,
        1,
        500, // 500g
        "pix@produtor.com"
      )
    ).to.be.revertedWith("Minimum 1kg (1000g).");
  });

  it("Não deve permitir que a fábrica processe um lote que não existe", async function () {
    const fakeBatchId = 999;
    
    // Autoriza a indústria primeiro
    await registry.setOperator(industry.address, true);

    await expect(
      registry.connect(industry).advanceBatchStage(fakeBatchId)
    ).to.be.revertedWith("Batch does not exist."); // Esse erro é disparado pelo CocoAsset
  });

  it("Não deve permitir listar um produto no mercado com preço zero", async function () {
    await expect(
      market.connect(industry).list(1, 50000, 0, false)
    ).to.be.revertedWith("Price must be > 0.");
  });

  it("Não deve permitir que qualquer um confirme um pagamento PIX (Apenas Oráculo)", async function () {
    // Vamos criar um pagamento legítimo primeiro
    await registry.connect(collector).registerDelivery(producer.address, 1, 10000, "pix@valido.com");
    // ID da entrega é 1, ID do pagamento gerado é 1

    await expect(
      paymentLedger.connect(maliciousActor).confirmPayment(1, "TX-FAKE")
    ).to.be.reverted; // Reverts with AccessControl unauthorized error
  });

  it("Não deve permitir a cunhagem (mint) do NFT ESG por alguém sem a MINTER_ROLE", async function () {
    await expect(
      nft.connect(maliciousActor).issue(maliciousActor.address, 1, 5000, "Selo Falso")
    ).to.be.reverted; // AccessControl revert
  });

  it("Não deve permitir a transferência do NFT de Sustentabilidade (Soulbound)", async function () {
    // 1. Autorizar deployer temporariamente para mintar o NFT
    await nft.grantRole(MINTER_ROLE, deployer.address);
    
    // 2. Mintar um NFT para a indústria
    await nft.connect(deployer).issue(industry.address, 1, 10000, "Selo ESG Dourado");
    
    // 3. Tentar transferir o NFT da indústria para outra carteira
    await expect(
      nft.connect(industry).transferFrom(industry.address, maliciousActor.address, 1)
    ).to.be.revertedWith("Soulbound: token is non-transferable.");
  });
});
