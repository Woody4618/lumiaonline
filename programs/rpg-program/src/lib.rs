use std::mem::size_of;

use anchor_lang::{ prelude::* };

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod rpg_program {
    use super::*;

    pub fn create_character(ctx: Context<CreateCharacter>, name: String) -> Result<()> {
        let character = CharacterAccount::new(&name)?;

        ctx.accounts.character.set_inner(character);

        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct CharacterAccount {
    pub name: String,
    pub experience: u32,
}

const NAME_MAX_LENGTH: usize = 16;

impl CharacterAccount {
    pub fn space() -> usize {
        8 + size_of::<Self>()
    }

    pub fn new(name: &str) -> Result<Self> {
        require!(name.len() <= NAME_MAX_LENGTH, CharacterError::MaxNameLengthExceeded);

        let account = CharacterAccount {
            name: name.to_string(),
            experience: 0,
            ..Default::default()
        };

        Ok(account)
    }
}

pub const PREFIX: &str = "character";

#[derive(Accounts)]
pub struct CreateCharacter<'info> {
    #[account(
        init,
        space = CharacterAccount::space(),
        payer = owner,
        seeds = [PREFIX.as_ref(), owner.key().as_ref()],
        bump
    )]
    pub character: Account<'info, CharacterAccount>,
    /// Character owner keypair.
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum CharacterError {
    #[msg("Name is too long. Max. length is 16 bytes.")]
    MaxNameLengthExceeded,
}