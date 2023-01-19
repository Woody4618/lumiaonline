use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vault {
    use anchor_lang::system_program::{transfer, Transfer};

    use super::*;

    pub fn initialize(ctx: Context<InitializeVault>) -> Result<()> {
        *ctx.accounts.vault = Vault {
            owner: ctx.accounts.owner.key(),
            authority: ctx.accounts.authority.key(),
        };

        Ok(())
    }

    pub fn sol_deposit(ctx: Context<SolDeposit>, amount: u64) -> Result<()> {
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.owner.to_account_info(),
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

    // pub fn spl_deposit(ctx: Context<SplDeposit>) -> Result<()> {
    //     Ok(())
    // }
    // pub fn spl_withdraw(ctx: Context<SplWithdraw>) -> Result<()> {
    //     Ok(())
    // }
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
    #[account(
        mut,
        seeds = [
          Vault::PREFIX,
          owner.key().as_ref(),
          authority.key().as_ref()
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
pub struct SolWithdraw<'info> {
    #[account(
        mut,
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

/* State */
#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub authority: Pubkey,
}

impl Vault {
    pub const PREFIX: &'static [u8] = b"vault";
    pub const LEN: usize = 32 + 32;
}
