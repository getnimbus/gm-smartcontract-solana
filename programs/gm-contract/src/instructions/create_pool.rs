use crate::state::*;

use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token},
};

pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
    let pool = &mut ctx.accounts.pool;

    pool.admin = ctx.accounts.admin.key();
    pool.mint_token = ctx.accounts.mint_token.key();
    pool.winner_list = Vec::with_capacity(3);
    pool.claimed_list = Vec::with_capacity(3);

    Ok(())
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(
            init,
            payer = admin,
            space = Pool::INIT_SPACE,
            seeds = [b"pool", admin.key().as_ref()],
            bump,
        )]
    pub pool: Box<Account<'info, Pool>>,

    /// CHECK: Read only authority
    #[account(
        seeds = [
            b"authority",
            admin.key().as_ref(),
        ],
        bump,
    )]
    pub pool_authority: AccountInfo<'info>,

    pub mint_token: Box<Account<'info, Mint>>,

    #[account(
            init,
            payer = admin,
            associated_token::mint = mint_token,
            associated_token::authority = pool_authority,
        )]
    pub pool_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
