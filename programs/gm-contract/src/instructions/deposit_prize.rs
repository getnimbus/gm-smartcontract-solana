use crate::errors::*;
use crate::state::*;

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

pub fn deposit_prize(
    ctx: Context<DepositPrize>,
    data: Vec<Pubkey>,
    amount: u64,
    expired_time: u64,
) -> Result<()> {
    require!(
        ctx.accounts.depositor.key() == ctx.accounts.pool.admin.key(),
        AppError::InvalidAuthority
    );
    require!(data.len() == 3, AppError::InvalidWinnerList);
    require!(amount > 0, AppError::InvalidPrizeAmount);
    require!(
        amount <= ctx.accounts.depositor_account.amount,
        AppError::DepositNotEnough
    );

    let clock = Clock::get()?;
    require!(expired_time > clock.slot, AppError::InvalidExpiredTime);

    // transfer all remain prize to admin
    if ctx.accounts.pool_account.amount > 0 {
        // pool authority signer
        let authority_bump = ctx.bumps.pool_authority;

        let authority_seeds = &[
            b"authority".as_ref(),
            &ctx.accounts.pool.admin.to_bytes(),
            &[authority_bump],
        ];

        let signer_seeds = &[&authority_seeds[..]];

        // transfer all remain token from prize pool to admin
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.pool_account.to_account_info(),
                    to: ctx.accounts.depositor_account.to_account_info(),
                    authority: ctx.accounts.pool_authority.to_account_info(),
                },
                signer_seeds,
            ),
            ctx.accounts.pool_account.amount,
        )?;
    }

    // set winner list
    let pool = &mut ctx.accounts.pool;
    pool.winner_list = data;
    pool.claimed_list.clear();
    pool.expired_time = expired_time;

    // transfer token A from depositer to pool account
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.depositor_account.to_account_info(),
                to: ctx.accounts.pool_account.to_account_info(),
                authority: ctx.accounts.depositor.to_account_info(),
            },
        ),
        amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct DepositPrize<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.admin.key().as_ref()],
        bump,
        has_one = mint_token,
    )]
    pool: Box<Account<'info, Pool>>,

    /// CHECK read-only account
    #[account(
        seeds = [
            b"authority",
            pool.admin.key().as_ref(),
        ],
        bump
    )]
    pub pool_authority: AccountInfo<'info>,

    pub mint_token: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint_token,
        associated_token::authority = pool_authority,
    )]
    pool_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint_token,
        associated_token::authority = depositor,
    )]
    depositor_account: Account<'info, TokenAccount>,

    #[account(mut)]
    depositor: Signer<'info>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
}
