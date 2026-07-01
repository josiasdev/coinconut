// COINCONUT - Zero-Knowledge ESG Proof
// 
// Esse circuito prova que a Indústria possui uma quantidade de casca
// de coco processada (peso_processado) que atende ou supera o 
// requisito mínimo (peso_minimo) do nível do Selo ESG.
//
// Variáveis:
// - processed_weight: PRIVADO (Apenas a Indústria sabe a quantia exata).
// - minimum_weight: PÚBLICO (O Smart Contract do Soroban verifica isso).

fn main(processed_weight: u64, minimum_weight: pub u64) {
    // A assertiva principal (Constraint).
    // Se a indústria mentir o peso, a prova criptográfica vai falhar.
    assert(processed_weight >= minimum_weight);
}
