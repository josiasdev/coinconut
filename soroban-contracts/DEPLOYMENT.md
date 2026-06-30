# Coinconut Soroban Contract Deployment

**Network:** Stellar Testnet

**Contract ID:** `CB6IOBT6MCBGPUKAI3EIVN26GQWVIFHRXG5CEPPPHOSEGNT22LB7J2X5`

## Functions

### Core Batch Logic (Replaces CocoAsset.sol)
- `create_batch(supplier: Address, weight_grams: u32) -> u32`
- `advance_stage(batch_id: u32)`
- `finalize_as_adubo(batch_id: u32)`
- `get_batch(batch_id: u32) -> Batch`

### Sustainability NFT Logic (Replaces SustainabilityNFT.sol)
- `issue_cert(buyer: Address, batch_id: u32, weight_grams: u32, product_type: String) -> u32`
- `get_cert(cert_id: u32) -> Certificate`
