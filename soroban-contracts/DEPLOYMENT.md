# Coinconut Soroban Contract Deployment

**Network:** Stellar Testnet

**Contract ID:** `CCIJZTJJBPU3CHI3235FR7SY22F5IOYQJOV3WAYNB3OY3MQ7TOI4AA3P`

## Functions

### Core Batch Logic
- `create_batch(supplier: Address, weight_grams: u32) -> u32`
- `advance_stage(batch_id: u32)`
- `finalize_as_adubo(batch_id: u32)`
- `get_batch(batch_id: u32) -> Batch`

### Sustainability NFT Logic (ESG)
- `issue_cert(buyer: Address, batch_id: u32, weight_grams: u32, product_type: String) -> u32`
- `get_cert(cert_id: u32) -> Certificate`

### Zero-Knowledge Logic (B2B Privacy)
- `issue_cert_zk(buyer: Address, proof: Bytes, public_inputs: Bytes, minimum_weight_threshold: u32) -> u32`
