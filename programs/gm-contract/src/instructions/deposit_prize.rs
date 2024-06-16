use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use spl_math::uint::U256;
use std::mem::size_of;

use crate::state::Pool;

pub fn deposit_prize(ctx: Context<DepositPrize>, data: Vec<Pubkey>, amount: u64) -> Result<()> {
    // TODO: check data length == 3
    // TODO: check amount > 0 and depositer amount > 0
    // TODO: check depositer = admin

    // set winner list
    let pool = &mut ctx.accounts.pool;
    pool.winner_list = data;

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
