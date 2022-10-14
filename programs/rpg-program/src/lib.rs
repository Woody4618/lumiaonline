use std::{ mem::size_of };

use anchor_lang::{ prelude::* };
use anchor_spl::token::{ Mint, TokenAccount };
use metadata::{ TokenMetadata, MetadataAccount };
pub mod metadata;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod rpg_program {
    use super::*;

    #[access_control(CreateCharacter::validate_nft(&ctx))]
    pub fn create_character(ctx: Context<CreateCharacter>, name: String) -> Result<()> {
        let character = CharacterAccount::new(
            ctx.accounts.owner.key(),
            ctx.accounts.nft_mint.key(),
            &name
        )?;

        ctx.accounts.character.set_inner(character);

        Ok(())
    }

    pub fn create_quest(ctx: Context<CreateQuest>, config: QuestConfig) -> Result<()> {
        let quest = QuestAccount {
            config,
        };

        ctx.accounts.quest.set_inner(quest);

        Ok(())
    }

    pub fn create_monster(ctx: Context<CreateMonster>, config: MonsterConfig) -> Result<()> {
        let monster = MonsterAccount {
            config,
        };

        ctx.accounts.monster.set_inner(monster);

        Ok(())
    }

    pub fn join_quest(ctx: Context<JoinQuest>) -> Result<()> {
        ctx.accounts.character.quest_state = Some(QuestState {
            quest_uuid: ctx.accounts.quest.config.uuid.clone(),
            started_at: ctx.accounts.clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn claim_quest(ctx: Context<ClaimQuest>) -> Result<()> {
        let required_timestamp =
            ctx.accounts.character.quest_state.as_ref().unwrap().started_at +
            ctx.accounts.quest.config.duration;

        require_gte!(
            ctx.accounts.clock.unix_timestamp,
            required_timestamp,
            QuestError::InvalidTimestamp
        );

        ctx.accounts.character.experience += ctx.accounts.quest.config.reward_exp;

        ctx.accounts.character.quest_state = None;

        Ok(())
    }

    pub fn join_battle(ctx: Context<JoinBattle>, battle_turns: Vec<BattleTurn>) -> Result<()> {
        let last_turn = battle_turns.last().unwrap();

        if last_turn.character_hitpoints <= 0 {
            // ctx.accounts.character.deaths.push(Death {
            //     monster_uuid: ctx.accounts.monster.config.uuid.clone(),
            //     timestamp: ctx.accounts.clock.unix_timestamp,
            // });

            ctx.accounts.character.deaths += 1;
        }

        let battle = BattleAccount {
            battle_turns,
        };

        ctx.accounts.battle.set_inner(battle);

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BattleTurn {
    character_damage: u64,
    monster_damage: u64,
    character_hitpoints: i64,
    monster_hitpoints: i64,
}

#[derive(Accounts)]
#[instruction(config: MonsterConfig)]
pub struct CreateMonster<'info> {
    #[account(
        init,
        seeds = [b"monster".as_ref(), config.uuid.as_ref()],
        bump,
        payer = signer,
        space = 8 + size_of::<MonsterAccount>()
    )]
    pub monster: Account<'info, MonsterAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MonsterConfig {
    pub uuid: String,
    pub hitpoints: u64,
    pub melee_skill: u8,
}

#[account]
pub struct BattleAccount {
    battle_turns: Vec<BattleTurn>,
}

#[derive(Accounts)]
#[instruction(battle_turns: Vec<BattleTurn>)]
pub struct JoinBattle<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + size_of::<BattleAccount>() + size_of::<BattleTurn>() * battle_turns.len()
    )]
    pub battle: Account<'info, BattleAccount>,
    #[account(mut,
    constraint = character.owner.key() == owner.key())]
    pub character: Account<'info, CharacterAccount>,
    #[account(mut)]
    pub monster: Account<'info, MonsterAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MonsterAccount {
    config: MonsterConfig,
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct QuestState {
    started_at: i64,
    quest_uuid: String,
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

#[derive(Accounts)]
#[instruction(config: QuestConfig)]
pub struct CreateQuest<'info> {
    #[account(
        init,
        seeds = [b"quest".as_ref(), config.uuid.as_ref()],
        bump,
        payer = signer,
        space = 8 + size_of::<QuestAccount>()
    )]
    pub quest: Account<'info, QuestAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
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

pub const CHARACTER_PREFIX: &str = "character";

#[derive(Accounts)]
pub struct CreateCharacter<'info> {
    // -- Basic accounts
    #[account(
        init,
        space = 8 + size_of::<CharacterAccount>(),
        payer = owner,
        seeds = [CHARACTER_PREFIX.as_ref(), owner.key().as_ref(), nft_mint.key().as_ref()],
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
            .map_err(|_| CharacterError::InvalidOwner.into())
    }

    pub fn validate_nft(ctx: &Context<Self>) -> Result<()> {
        Self::verify_holder(ctx)
    }
}

#[error_code]
pub enum CharacterError {
    #[msg("Name is too long. Max. length is 16 bytes.")]
    MaxNameLengthExceeded,
    #[msg("Owner must be the current holder.")]
    InvalidOwner,
}

#[error_code]
pub enum QuestError {
    #[msg("The character haven't been on this quest long enough.")]
    InvalidTimestamp,
}