#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Stage {
    Recebido = 0,
    Moido = 1,
    UmidadeAjustada = 2,
    Compactado = 3,
    Finalizado = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Batch {
    pub id: u32,
    pub supplier: Address,
    pub weight_grams: u32,
    pub stage: Stage,
    pub created_at: u64,
    pub updated_at: u64,
    pub is_adubo: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Certificate {
    pub buyer: Address,
    pub batch_id: u32,
    pub weight_grams: u32,
    pub issued_at: u64,
    pub product_type: String,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    BatchCount,
    Batch(u32),
    CertCount,
    Certificate(u32),
}

#[contract]
pub struct CoinconutContract;

#[contractimpl]
impl CoinconutContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized")
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::BatchCount, &0u32);
        env.storage().instance().set(&DataKey::CertCount, &0u32);
    }

    pub fn create_batch(env: Env, supplier: Address, weight_grams: u32) -> u32 {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut count: u32 = env.storage().instance().get(&DataKey::BatchCount).unwrap();
        count += 1;

        let now = env.ledger().timestamp();
        let batch = Batch {
            id: count,
            supplier: supplier.clone(),
            weight_grams,
            stage: Stage::Recebido,
            created_at: now,
            updated_at: now,
            is_adubo: false,
        };

        env.storage().persistent().set(&DataKey::Batch(count), &batch);
        env.storage().instance().set(&DataKey::BatchCount, &count);

        env.events().publish((symbol_short!("batch_cre"), count), (supplier, weight_grams, now));

        count
    }

    pub fn advance_stage(env: Env, batch_id: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut batch: Batch = env.storage().persistent().get(&DataKey::Batch(batch_id)).unwrap_or_else(|| panic!("batch not found"));
        
        let previous = batch.stage.clone();
        let next = match previous {
            Stage::Recebido => Stage::Moido,
            Stage::Moido => Stage::UmidadeAjustada,
            Stage::UmidadeAjustada => Stage::Compactado,
            Stage::Compactado => Stage::Finalizado,
            Stage::Finalizado => panic!("batch already finalized"),
        };

        batch.stage = next.clone();
        batch.updated_at = env.ledger().timestamp();

        if next == Stage::Finalizado {
            env.events().publish((symbol_short!("batch_fin"), batch_id), (false, batch.updated_at));
        }

        env.storage().persistent().set(&DataKey::Batch(batch_id), &batch);
        env.events().publish((symbol_short!("stage_adv"), batch_id), (previous as u32, next as u32, batch.updated_at));
    }

    pub fn finalize_as_adubo(env: Env, batch_id: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut batch: Batch = env.storage().persistent().get(&DataKey::Batch(batch_id)).unwrap_or_else(|| panic!("batch not found"));
        if batch.stage != Stage::Recebido {
            panic!("only receivable batches can become adubo");
        }

        batch.stage = Stage::Finalizado;
        batch.is_adubo = true;
        batch.updated_at = env.ledger().timestamp();

        env.storage().persistent().set(&DataKey::Batch(batch_id), &batch);
        env.events().publish((symbol_short!("batch_fin"), batch_id), (true, batch.updated_at));
    }

    pub fn get_batch(env: Env, batch_id: u32) -> Batch {
        env.storage().persistent().get(&DataKey::Batch(batch_id)).unwrap_or_else(|| panic!("batch not found"))
    }

    pub fn issue_cert(env: Env, buyer: Address, batch_id: u32, weight_grams: u32, product_type: String) -> u32 {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut count: u32 = env.storage().instance().get(&DataKey::CertCount).unwrap();
        count += 1;

        let now = env.ledger().timestamp();
        let cert = Certificate {
            buyer: buyer.clone(),
            batch_id,
            weight_grams,
            issued_at: now,
            product_type: product_type.clone(),
        };

        env.storage().persistent().set(&DataKey::Certificate(count), &cert);
        env.storage().instance().set(&DataKey::CertCount, &count);

        env.events().publish((symbol_short!("cert_iss"), count), (buyer, batch_id, weight_grams, product_type, now));

        count
    }

    pub fn get_cert(env: Env, cert_id: u32) -> Certificate {
        env.storage().persistent().get(&DataKey::Certificate(cert_id)).unwrap_or_else(|| panic!("certificate not found"))
    }
}

mod test;
