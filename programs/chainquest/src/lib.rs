use std::{ mem::size_of };

use anchor_lang::{ prelude::* };
use anchor_spl::token::{ Mint, TokenAccount };
use metadata::{ TokenMetadata, MetadataAccount };

pub mod metadata;
pub mod state;

use state::*;

declare_id!("D6o7C1xgcgvDRRnNp8KFUNQ1Ki1pMrVGVqbuh9YF9vGb");

#[program]
pub mod chainquest {
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
        melee_skill: u8
    ) -> Result<()> {
        let monster_type = MonsterTypeAccount {
            name,
            hitpoints,
            melee_skill,
        };

        ctx.accounts.monster_type.set_inner(monster_type);

        Ok(())
    }

    pub fn create_monster_spawn(ctx: Context<CreateMonsterSpawn>, spawntime: i64) -> Result<()> {
        let monster_spawn = MonsterSpawnAccount {
            monster_type: ctx.accounts.monster_type.key(),
            spawntime,
            last_killed: None,
        };

        ctx.accounts.monster_spawn.set_inner(monster_spawn);

        Ok(())
    }

    /// battle between a character and a monster spawn
    pub fn join_battle(ctx: Context<JoinBattle>, battle_turns: Vec<BattleTurn>) -> Result<()> {
        // if there is last_killed, then validate the timestamp
        if ctx.accounts.monster_spawn.last_killed.is_some() {
            let required_timestamp =
                ctx.accounts.monster_spawn.last_killed.as_ref().unwrap() +
                ctx.accounts.monster_spawn.spawntime;

            require_gte!(
                ctx.accounts.clock.unix_timestamp,
                required_timestamp,
                SpawnTypeError::InvalidTimestamp
            );
        }

        let last_turn = battle_turns.last().unwrap();

        if last_turn.character_hitpoints <= 0 {
            ctx.accounts.character.deaths += 1;
        }

        let battle = BattleAccount {
            battle_turns,
            participants: vec![ctx.accounts.character.key(), ctx.accounts.monster_type.key()],
        };

        ctx.accounts.battle.set_inner(battle);

        ctx.accounts.monster_spawn.last_killed = Some(ctx.accounts.clock.unix_timestamp);

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
            QuestError::InvalidTimestamp
        );

        ctx.accounts.character.experience += ctx.accounts.quest.reward_exp;

        ctx.accounts.character.quest_state = None;

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
    #[msg("The character hasn't been on this quest long enough.")]
    InvalidTimestamp,
}

#[error_code]
pub enum SpawnTypeError {
    #[msg("The monster hasn't spawned yet.")]
    InvalidTimestamp,
}