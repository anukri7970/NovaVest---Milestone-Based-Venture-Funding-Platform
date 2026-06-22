#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Vec};
use vault::VaultClient;
use governance_token::GovernanceTokenClient;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub description: String,
    pub percentage: u32,
    pub approved: bool,
    pub votes_for: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub startup: Address,
    pub name: String,
    pub goal: i128,
    pub raised: i128,
    pub milestones: Vec<Milestone>,
    pub current_milestone_index: u32,
}

#[contracttype]
pub enum DataKey {
    Admin,
    VaultContract,
    GovTokenContract,
    NativeToken,
    CampaignCount,
    Campaign(u32),
    HasVoted(u32, u32, Address), // CampaignID, MilestoneIndex, Investor
}

#[contract]
pub struct CampaignManager;

#[contractimpl]
impl CampaignManager {
    pub fn initialize(
        env: Env,
        admin: Address,
        vault_contract: Address,
        gov_token_contract: Address,
        native_token: Address,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::VaultContract, &vault_contract);
        env.storage().instance().set(&DataKey::GovTokenContract, &gov_token_contract);
        env.storage().instance().set(&DataKey::NativeToken, &native_token);
        env.storage().instance().set(&DataKey::CampaignCount, &0u32);
    }

    pub fn create_campaign(
        env: Env,
        startup: Address,
        name: String,
        goal: i128,
        milestones: Vec<Milestone>,
    ) -> u32 {
        startup.require_auth();

        let mut total_percentage = 0;
        for m in milestones.iter() {
            total_percentage += m.percentage;
        }
        if total_percentage != 100 {
            panic!("milestones must sum to 100 percent");
        }

        let mut count: u32 = env.storage().instance().get(&DataKey::CampaignCount).unwrap();
        count += 1;

        let campaign = Campaign {
            startup: startup.clone(),
            name: name.clone(),
            goal,
            raised: 0,
            milestones,
            current_milestone_index: 0,
        };

        env.storage().persistent().set(&DataKey::Campaign(count), &campaign);
        env.storage().instance().set(&DataKey::CampaignCount, &count);

        env.events().publish((soroban_sdk::Symbol::new(&env, "campaign_created"), count), startup);

        count
    }

    pub fn invest(env: Env, investor: Address, campaign_id: u32, amount: i128) {
        investor.require_auth();
        if amount <= 0 {
            panic!("investment must be positive");
        }

        let mut campaign: Campaign = env.storage().persistent().get(&DataKey::Campaign(campaign_id)).expect("campaign not found");
        
        // Transfer native token from investor to Vault
        let native_token: Address = env.storage().instance().get(&DataKey::NativeToken).unwrap();
        let token_client = token::Client::new(&env, &native_token);
        let vault_contract: Address = env.storage().instance().get(&DataKey::VaultContract).unwrap();
        
        token_client.transfer(&investor, &vault_contract, &amount);

        campaign.raised += amount;
        env.storage().persistent().set(&DataKey::Campaign(campaign_id), &campaign);

        // Mint Governance Tokens to investor
        let gov_contract: Address = env.storage().instance().get(&DataKey::GovTokenContract).unwrap();
        let gov_client = GovernanceTokenClient::new(&env, &gov_contract);
        
        // Convert amount to u32 for token minting (simplified 1:1 voting power)
        let voting_power: u32 = (amount / 10_000_000) as u32; // 1 token per XLM
        if voting_power > 0 {
            gov_client.mint(&investor, &campaign_id, &voting_power);
        }

        env.events().publish((soroban_sdk::Symbol::new(&env, "invested"), campaign_id), (investor, amount));
    }

    pub fn vote_milestone(env: Env, investor: Address, campaign_id: u32, vote_yes: bool) {
        investor.require_auth();

        let mut campaign: Campaign = env.storage().persistent().get(&DataKey::Campaign(campaign_id)).expect("campaign not found");
        let m_index = campaign.current_milestone_index;
        
        if m_index >= campaign.milestones.len() {
            panic!("all milestones completed");
        }

        let vote_key = DataKey::HasVoted(campaign_id, m_index, investor.clone());
        if env.storage().persistent().has(&vote_key) {
            panic!("already voted on this milestone");
        }

        let gov_contract: Address = env.storage().instance().get(&DataKey::GovTokenContract).unwrap();
        let gov_client = GovernanceTokenClient::new(&env, &gov_contract);
        let balance = gov_client.balance(&investor, &campaign_id);

        if balance == 0 {
            panic!("no voting power");
        }

        if vote_yes {
            let mut milestone = campaign.milestones.get(m_index).unwrap();
            milestone.votes_for += balance;
            campaign.milestones.set(m_index, milestone);
            env.storage().persistent().set(&DataKey::Campaign(campaign_id), &campaign);
        }

        env.storage().persistent().set(&vote_key, &true);
        env.events().publish((soroban_sdk::Symbol::new(&env, "voted"), campaign_id, m_index), (investor, vote_yes, balance));
    }

    pub fn release_milestone(env: Env, campaign_id: u32) {
        let mut campaign: Campaign = env.storage().persistent().get(&DataKey::Campaign(campaign_id)).expect("campaign not found");
        let m_index = campaign.current_milestone_index;

        if m_index >= campaign.milestones.len() {
            panic!("all milestones completed");
        }

        let mut milestone = campaign.milestones.get(m_index).unwrap();
        if milestone.approved {
            panic!("milestone already approved");
        }

        let gov_contract: Address = env.storage().instance().get(&DataKey::GovTokenContract).unwrap();
        let gov_client = GovernanceTokenClient::new(&env, &gov_contract);
        let total_supply = gov_client.total_supply(&campaign_id);

        if milestone.votes_for <= total_supply / 2 {
            panic!("not enough votes to release milestone");
        }

        milestone.approved = true;
        campaign.milestones.set(m_index, milestone.clone());
        campaign.current_milestone_index += 1;
        env.storage().persistent().set(&DataKey::Campaign(campaign_id), &campaign);

        // Calculate amount to release
        let release_amount = (campaign.raised * (milestone.percentage as i128)) / 100;

        let vault_contract: Address = env.storage().instance().get(&DataKey::VaultContract).unwrap();
        let vault_client = VaultClient::new(&env, &vault_contract);
        vault_client.release_funds(&campaign.startup, &release_amount);

        env.events().publish((soroban_sdk::Symbol::new(&env, "milestone_released"), campaign_id), m_index);
    }

    pub fn get_campaign(env: Env, campaign_id: u32) -> Campaign {
        env.storage().persistent().get(&DataKey::Campaign(campaign_id)).expect("campaign not found")
    }

    pub fn get_campaign_count(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::CampaignCount).unwrap_or(0)
    }
}
