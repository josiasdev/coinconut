#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_coinconut_flow() {
    let env = Env::default();
    let contract_id = env.register(CoinconutContract, ());
    let client = CoinconutContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let supplier = Address::generate(&env);
    let buyer = Address::generate(&env);

    client.initialize(&admin);

    env.mock_all_auths();

    // Test creating a batch
    let batch_id = client.create_batch(&supplier, &1000u32);
    assert_eq!(batch_id, 1);

    let batch = client.get_batch(&batch_id);
    assert_eq!(batch.supplier, supplier);
    assert_eq!(batch.weight_grams, 1000);
    assert_eq!(batch.stage, Stage::Recebido);
    assert_eq!(batch.is_adubo, false);

    // Test advancing stage
    client.advance_stage(&batch_id);
    let batch_moido = client.get_batch(&batch_id);
    assert_eq!(batch_moido.stage, Stage::Moido);

    // Test issue cert
    let product_type = String::from_str(&env, "briquette");
    let cert_id = client.issue_cert(&buyer, &batch_id, &1000u32, &product_type);
    assert_eq!(cert_id, 1);

    let cert = client.get_cert(&cert_id);
    assert_eq!(cert.buyer, buyer);
    assert_eq!(cert.batch_id, batch_id);
    assert_eq!(cert.product_type, product_type);
}
