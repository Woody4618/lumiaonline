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
        let quest = QuestAccount::new(config);
        ctx.accounts.quest.set_inner(quest);

        Ok(())
    }
}

impl QuestAccount {
    pub fn new(config: QuestConfig) -> Self {
        Self {
            config,
        }
    }
}

#[account]
pub struct QuestAccount {
    pub config: QuestConfig,
}

impl QuestAccount {
    pub fn space() -> usize {
        8 + size_of::<Self>()
    }
}

#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
pub struct QuestConfig {
    pub duration: u64,
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
        space = QuestAccount::space()
    )]
    pub quest: Account<'info, QuestAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct CharacterAccount {
    pub owner: Pubkey,
    pub nft_mint: Pubkey,
    pub name: String,
    pub experience: u32,
}

const NAME_MAX_LENGTH: usize = 16;

impl CharacterAccount {
    pub fn space() -> usize {
        8 + size_of::<Self>()
    }

    pub fn new(owner: Pubkey, nft_mint: Pubkey, name: &str) -> Result<Self> {
        require!(name.len() <= NAME_MAX_LENGTH, CharacterError::MaxNameLengthExceeded);

        let account = CharacterAccount {
            name: name.to_string(),
            experience: 0,
            owner,
            nft_mint,
            ..Default::default()
        };

        Ok(account)
    }
}

pub const PREFIX: &str = "character";

#[derive(Accounts)]
pub struct CreateCharacter<'info> {
    // -- Basic accounts
    #[account(
        init,
        space = CharacterAccount::space(),
        payer = owner,
        seeds = [PREFIX.as_ref(), owner.key().as_ref(), nft_mint.key().as_ref()],
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