use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vault {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        *ctx.accounts.vault = Vault {
            owner: ctx.accounts.owner.key(),
            authority: ctx.accounts.authority.key(),
            bump: [*ctx.bumps.get("vault").unwrap()],
        };

        Ok(())
    }

    pub fn sol_deposit(ctx: Context<SolDeposit>, amount: u64) -> Result<()> {
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.from.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount,
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
                },
            ),
            amount,
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
            },
        );
        anchor_spl::token::transfer(
            cpi_ctx.with_signer(&[&ctx.accounts.vault.seeds()]),
            amount,
        )?;
        Ok(())
    }
}

/* Instructions */
#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Vault::LEN,
        seeds = [
          Vault::PREFIX,
          owner.key().as_ref(),
          authority.key().as_ref(),
        ],
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
        seeds = [
          Vault::PREFIX,
          owner.key().as_ref(),
          authority.key().as_ref()
        ],
        bump
    )]
    pub vault: Account<'info, Vault>,

    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint,
        associated_token::authority = vault,
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
        seeds = [
          Vault::PREFIX,
          owner.key().as_ref(),
          authority.key().as_ref()
        ],
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
        associated_token::authority = owner,
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

/* State */
#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub authority: Pubkey,
    bump: [u8; 1],
}

impl Vault {
    pub const PREFIX: &'static [u8] = b"vault";
    pub const LEN: usize = 32 + 32 + 1;

    pub fn seeds(&self) -> [&[u8]; 4] {
        [
            Self::PREFIX,
            self.owner.as_ref(),
            self.authority.as_ref(),
            &self.bump,
        ]
    }
}
