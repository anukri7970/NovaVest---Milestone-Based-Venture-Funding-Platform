#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
pub enum DataKey {
    Admin, // The Campaign Manager contract
    NativeToken,
}

#[contract]
pub struct Vault;

#[contractimpl]
impl Vault {
    pub fn initialize(env: Env, admin: Address, native_token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NativeToken, &native_token);
    }

    pub fn release_funds(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let native_token: Address = env.storage().instance().get(&DataKey::NativeToken).unwrap();
        let token_client = token::Client::new(&env, &native_token);
        
        let vault_address = env.current_contract_address();
        token_client.transfer(&vault_address, &to, &amount);

        env.events().publish((soroban_sdk::Symbol::new(&env, "funds_released"), to), amount);
    }
}
