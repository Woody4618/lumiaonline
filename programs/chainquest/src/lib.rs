/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 Lumia Online

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
use std::mem::size_of;

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{ Mint, Token, TokenAccount },
};
use metadata::{ MetadataAccount, TokenMetadata };

pub mod metadata;
pub mod state;

use state::*;

declare_id!("D6o7C1xgcgvDRRnNp8KFUNQ1Ki1pMrVGVqbuh9YF9vGb");

const NAME_MAX_LENGTH: usize = 16;

#[program]
pub mod chainquest {
    use super::*;

    #[access_control(CreateCharacter::validate_nft(&ctx))]
    pub fn create_character(
        ctx: Context<CreateCharacter>,
        name: String
    ) -> Result<()> {
        require!(
            name.len() <= NAME_MAX_LENGTH,
            LibError::MaxNameLengthExceeded
        );

        let character = CharacterAccount::new(
            ctx.accounts.owner.key(),
            ctx.accounts.nft_mint.key(),
            &name
        )?;

        ctx.accounts.character.set_inner(character);

        Ok(())
    }

    pub fn create_quest(
        ctx: Context<CreateQuest>,
        duration: i64,
        reward_exp: u64,
        id: String
    ) -> Result<()> {
        let quest = QuestAccount {
            duration,
            reward_exp,
            id,
        };

        ctx.accounts.quest.set_inner(quest);

        Ok(())
    }

    pub fn create_monster_type(
        ctx: Context<CreateMonsterType>,
        name: String,
        hitpoints: u64,
        melee_skill: u8,
        experience: u64
    ) -> Result<()> {
        let monster_type = MonsterTypeAccount {
            name,
            hitpoints,
            melee_skill,
            experience,
        };

        ctx.accounts.monster_type.set_inner(monster_type);

        Ok(())
    }

    pub fn create_monster_spawn(
        ctx: Context<CreateMonsterSpawn>,
        spawntime: i64
    ) -> Result<()> {
        let monster_spawn = MonsterSpawnAccount {
            monster_type: ctx.accounts.monster_type.key(),
            spawntime,
            last_killed: None,
        };

        ctx.accounts.monster_spawn.set_inner(monster_spawn);

        Ok(())
    }

    /// battle between a character and a monster spawn
    pub fn join_battle(
        ctx: Context<JoinBattle>,
        battle_turns: Vec<BattleTurn>
    ) -> Result<()> {
        // if there is last_killed, then validate the timestamp
        if ctx.accounts.monster_spawn.last_killed.is_some() {
            let required_timestamp =
                ctx.accounts.monster_spawn.last_killed.as_ref().unwrap() +
                ctx.accounts.monster_spawn.spawntime;

            require_gte!(
                ctx.accounts.clock.unix_timestamp,
                required_timestamp,
                LibError::InvalidSpawnTimestamp
            );
        }

        let last_turn = battle_turns.last().unwrap();

        if last_turn.character_hitpoints <= 0 {
            ctx.accounts.character.deaths += 1;
        } else {
            ctx.accounts.character.add_exp(
                ctx.accounts.monster_type.experience
            );
        }

        let battle = BattleAccount {
            battle_turns,
            participants: vec![
                ctx.accounts.character.key(),
                ctx.accounts.monster_type.key()
            ],
            timestamp: ctx.accounts.clock.unix_timestamp,
        };

        ctx.accounts.battle.set_inner(battle);

        ctx.accounts.monster_spawn.last_killed = Some(
            ctx.accounts.clock.unix_timestamp
        );

        Ok(())
    }

    pub fn join_quest(ctx: Context<JoinQuest>) -> Result<()> {
        ctx.accounts.character.quest_state = Some(CharacterQuestState {
            quest_id: ctx.accounts.quest.id.clone(),
            started_at: ctx.accounts.clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn claim_quest(ctx: Context<ClaimQuest>) -> Result<()> {
        let required_timestamp =
            ctx.accounts.character.quest_state.as_ref().unwrap().started_at +
            ctx.accounts.quest.duration;

        require_gte!(
            ctx.accounts.clock.unix_timestamp,
            required_timestamp,
            LibError::InvalidQuestTimestamp
        );

        ctx.accounts.character.add_exp(ctx.accounts.quest.reward_exp);

        ctx.accounts.character.quest_state = None;

        Ok(())
    }

    /* Player vault instructions */
    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        *ctx.accounts.vault = Vault {
            owner: ctx.accounts.owner.key(),
            authority: ctx.accounts.authority.key(),
            bump: [*ctx.bumps.get("vault").unwrap()],
        };

        Ok(())
    }

    pub fn sol_deposit(ctx: Context<SolDeposit>, amount: u64) -> Result<()> {
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                }
            ),
            amount
        )?;

        Ok(())
    }

    pub fn sol_withdraw(ctx: Context<SolWithdraw>, amount: u64) -> Result<()> {
        **ctx.accounts.vault.to_account_info().lamports.borrow_mut() -= amount;
        **ctx.accounts.owner.to_account_info().lamports.borrow_mut() += amount;
        Ok(())
    }

    pub fn spl_deposit(ctx: Context<SplDeposit>, amount: u64) -> Result<()> {
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.owner_ata.to_account_info(),
                    to: ctx.accounts.vault_ata.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                }
            ),
            amount
        )?;
        Ok(())
    }

    pub fn spl_withdraw(ctx: Context<SplWithdraw>, amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Transfer {
                to: ctx.accounts.owner_ata.to_account_info(),
                from: ctx.accounts.vault_ata.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            }
        );
        anchor_spl::token::transfer(
            cpi_ctx.with_signer(&[&ctx.accounts.vault.seeds()]),
            amount
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(spawntime: i64)]
pub struct CreateMonsterSpawn<'info> {
    #[account(
        init,
        seeds = [b"monster_spawn".as_ref(), monster_type.name.as_ref()],
        bump,
        payer = signer,
        space = 8 + size_of::<MonsterSpawnAccount>()
    )]
    pub monster_spawn: Account<'info, MonsterSpawnAccount>,

    #[account(mut)]
    pub monster_type: Account<'info, MonsterTypeAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateMonsterType<'info> {
    #[account(
        init,
        seeds = [b"monster_type".as_ref(), name.as_ref()],
        bump,
        payer = signer,
        space = 8 + size_of::<MonsterTypeAccount>()
    )]
    pub monster_type: Account<'info, MonsterTypeAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(battle_turns: Vec<BattleTurn>)]
pub struct JoinBattle<'info> {
    #[account(mut)]
    pub monster_type: Account<'info, MonsterTypeAccount>,

    #[account(mut, seeds = [b"monster_spawn".as_ref(), monster_type.name.as_ref()], bump)]
    pub monster_spawn: Account<'info, MonsterSpawnAccount>,

    #[account(
        init,
        payer = owner,
        space = 8 +
        size_of::<BattleAccount>() +
        size_of::<BattleTurn>() * battle_turns.len() +
        // space for two participants
        16 * 2
    )]
    pub battle: Account<'info, BattleAccount>,
    #[account(mut,
    constraint = character.owner.key() == owner.key())]
    pub character: Account<'info, CharacterAccount>,

    #[account(mut)]
    pub owner: Signer<'info>,
    clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimQuest<'info> {
    #[account(
        mut,
        seeds = [CHARACTER_PREFIX.as_ref(), owner.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub character: Account<'info, CharacterAccount>,
    pub quest: Account<'info, QuestAccount>,
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct JoinQuest<'info> {
    pub quest: Account<'info, QuestAccount>,
    #[account(
        mut,
        seeds = [CHARACTER_PREFIX.as_ref(), owner.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub character: Account<'info, CharacterAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
#[instruction(duration: i64,
    reward_exp: u64,
    id: String)]
pub struct CreateQuest<'info> {
    #[account(
        init,
        seeds = [b"quest".as_ref(), id.as_ref()],
        bump,
        payer = signer,
        space = 8 + size_of::<QuestAccount>()
    )]
    pub quest: Account<'info, QuestAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub const CHARACTER_PREFIX: &str = "character";

#[derive(Accounts)]
pub struct CreateCharacter<'info> {
    #[account(
        init,
        space = 8 + size_of::<CharacterAccount>(),
        payer = owner,
        seeds = [
            CHARACTER_PREFIX.as_ref(),
            owner.key().as_ref(),
            nft_mint.key().as_ref(),
        ],
        bump
    )]
    pub character: Account<'info, CharacterAccount>,

    /// Character owner keypair.
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,

    // -- Needed for the NFT integration.
    /// NFT Metadata account, owned by Metaplex metadata program (this address is automatically
    /// derived by the anchor client).
    #[account(
        seeds = [
            "metadata".as_ref(),
            token_metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
        ],
        seeds::program = token_metadata_program.key(),
        bump
    )]
    pub token_metadata: Account<'info, MetadataAccount>,
    /// Metaplex Token Metadata program address.
    pub token_metadata_program: Program<'info, TokenMetadata>,

    /// NFT address owned by the SPL token program.
    pub nft_mint: Account<'info, Mint>,
    /// Character owner ATA that holds the NFT.
    pub owner_token_account: Account<'info, TokenAccount>,
}

impl<'info> CreateCharacter<'info> {
    fn verify_holder(ctx: &Context<Self>) -> Result<()> {
        mpl_token_metadata::utils
            ::assert_currently_holding(
                &ctx.accounts.token_metadata_program.key(),
                &ctx.accounts.owner.to_account_info(),
                &ctx.accounts.token_metadata.to_account_info(),
                &ctx.accounts.token_metadata,
                &ctx.accounts.nft_mint.to_account_info(),
                &ctx.accounts.owner_token_account.to_account_info()
            )
            .map_err(|_| LibError::InvalidOwner.into())
    }

    pub fn validate_nft(ctx: &Context<Self>) -> Result<()> {
        Self::verify_holder(ctx)
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Vault::LEN,
        seeds = [Vault::PREFIX, owner.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SolDeposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub from: Signer<'info>,
    pub authority: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SolWithdraw<'info> {
    #[account(
        mut,
        has_one = owner,
        has_one = authority,
        seeds = [
          Vault::PREFIX,
          owner.key().as_ref(),
          authority.key().as_ref()
        ],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: SystemAccount<'info>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct SplDeposit<'info> {
    #[account(
        has_one = owner,
        has_one = authority,
        seeds = [Vault::PREFIX, owner.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = vault
    )]
    pub vault_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub owner_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub authority: Signer<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct SplWithdraw<'info> {
    #[account(
        has_one = owner,
        has_one = authority,
        seeds = [Vault::PREFIX, owner.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = vault,
    )]
    pub vault_ata: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = owner
    )]
    pub owner_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner: SystemAccount<'info>,
    pub authority: Signer<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[error_code]
pub enum LibError {
    #[msg("Name is too long. Max. length is 16 bytes.")]
    MaxNameLengthExceeded,
    #[msg("Owner must be the current holder.")]
    InvalidOwner,
    #[msg("The character hasn't been on this quest long enough.")]
    InvalidQuestTimestamp,
    #[msg("The monster hasn't spawned yet.")]
    InvalidSpawnTimestamp,
}