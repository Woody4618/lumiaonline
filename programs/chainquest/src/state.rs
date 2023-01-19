/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 lumiaonline

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
/// Contains information about a single battle turn between a character and a monster
pub struct BattleTurn {
    character_damage: u64,
    monster_damage: u64,
    pub character_hitpoints: i64,
    monster_hitpoints: i64,
}

#[account]
/// Holds information about a battle between a character and a monster
pub struct BattleAccount {
    pub battle_turns: Vec<BattleTurn>,
    pub participants: Vec<Pubkey>,
}

#[account]
/// Monster Spawn is an account used in battles that is spawning a Monster Type in a certain time interval
pub struct MonsterSpawnAccount {
    pub monster_type: Pubkey,
    pub spawntime: i64,
    /// defines the last time the monster was killed. this is used to determine if the monster can join a battle or not
    pub last_killed: Option<i64>,
}

#[account]
/// Monster Type is a type of monster that can be spawned. It holds all information about a monster
pub struct MonsterTypeAccount {
    pub name: String,
    pub hitpoints: u64,
    pub melee_skill: u8,
    pub experience: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CharacterQuestState {
    pub started_at: i64,
    pub quest_id: String,
}

#[account]
pub struct QuestAccount {
    pub duration: i64,
    pub reward_exp: u64,
    pub id: String,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Death {
    monster_id: String,
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
    /// pub deaths: Vec<Death>,
    pub deaths: u8,
    pub quest_state: Option<CharacterQuestState>,
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