#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address, u32), // Address and Campaign ID
    TotalSupply(u32),      // Campaign ID
}

#[contract]
pub struct GovernanceToken;

#[contractimpl]
impl GovernanceToken {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn mint(env: Env, to: Address, campaign_id: u32, amount: u32) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut balance = Self::balance(env.clone(), to.clone(), campaign_id);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(to.clone(), campaign_id), &balance);

        let mut supply = Self::total_supply(env.clone(), campaign_id);
        supply += amount;
        env.storage().persistent().set(&DataKey::TotalSupply(campaign_id), &supply);

        env.events().publish((soroban_sdk::Symbol::new(&env, "mint"), to, campaign_id), amount);
    }

    pub fn balance(env: Env, id: Address, campaign_id: u32) -> u32 {
        env.storage().persistent().get(&DataKey::Balance(id, campaign_id)).unwrap_or(0)
    }

    pub fn total_supply(env: Env, campaign_id: u32) -> u32 {
        env.storage().persistent().get(&DataKey::TotalSupply(campaign_id)).unwrap_or(0)
    }
}
