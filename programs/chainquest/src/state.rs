use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BattleTurn {
    character_damage: u64,
    monster_damage: u64,
    pub character_hitpoints: i64,
    monster_hitpoints: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SpawnInstanceConfig {
    pub monster_name: String,
    pub spawntime: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MonsterConfig {
    pub uuid: String,
    pub hitpoints: u64,
    pub melee_skill: u8,
}

#[account]
pub struct BattleAccount {
    pub battle_turns: Vec<BattleTurn>,
    pub participants: Vec<Pubkey>,
}

#[account]
pub struct SpawnInstanceAccount {
    pub config: SpawnInstanceConfig,
    // defines the last time the monster was killed. this is used to determine if the monster can join a battle or not
    pub last_killed: Option<i64>,
}

#[account]
pub struct MonsterTypeAccount {
    pub config: MonsterConfig,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct QuestState {
    pub started_at: i64,
    pub quest_uuid: String,
}

#[account]
pub struct QuestAccount {
    pub config: QuestConfig,
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct QuestConfig {
    pub duration: i64,
    pub reward_exp: u64,
    pub uuid: String,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Death {
    monster_uuid: String,
    timestamp: i64,
}

#[account]
#[derive(Default)]
pub struct CharacterAccount {
    pub owner: Pubkey,
    pub nft_mint: Pubkey,
    pub name: String,
    pub experience: u64,
    pub hitpoints: u64,
    // pub deaths: Vec<Death>,
    pub deaths: u8,
    pub quest_state: Option<QuestState>,
    pub melee_skill: u8,
}

const NAME_MAX_LENGTH: usize = 16;

impl CharacterAccount {
    pub fn new(owner: Pubkey, nft_mint: Pubkey, name: &str) -> Result<Self> {
        require!(name.len() <= NAME_MAX_LENGTH, CharacterError::MaxNameLengthExceeded);

        let account = CharacterAccount {
            name: name.to_string(),
            experience: 0,
            owner,
            nft_mint,
            deaths: 0,
            hitpoints: 4,
            quest_state: None,
            melee_skill: 10,
        };

        Ok(account)
    }
}

#[error_code]
pub enum CharacterError {
    #[msg("Name is too long. Max. length is 16 bytes.")]
    MaxNameLengthExceeded,
    #[msg("Owner must be the current holder.")]
    InvalidOwner,
}