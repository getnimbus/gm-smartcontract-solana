use crate::errors::*;
use crate::state::*;

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

pub fn withdraw_prize(ctx: Context<WithdrawPrize>) -> Result<()> {
    require!(
        ctx.accounts
            .pool
            .winner_list
            .contains(&ctx.accounts.depositor.key()),
        AppError::NotWinner
    );
    require!(
        !ctx.accounts
            .pool
            .claimed_list
            .contains(&ctx.accounts.depositor.key()),
        AppError::PrizeAlreadyClaim
    );
    require!(
        ctx.accounts.pool_account.amount > 0,
        AppError::PoolBalanceNotEnough
    );
    let clock = Clock::get()?;
    require!(
        ctx.accounts.pool.expired_time > clock.slot,
        AppError::MissedDeadline
    );

    // distribute prize amount
    let index = ctx
        .accounts
        .pool
        .winner_list
        .iter()
        .position(|x| *x == ctx.accounts.depositor.key())
        .unwrap();

    let prize_amount: u64 = if index == 0 {
        50
    } else if index == 1 {
        20
    } else {
        10
    };

    // pool authority signer
    let authority_bump = ctx.bumps.pool_authority;

    let authority_seeds = &[
        b"authority".as_ref(),
        &ctx.accounts.pool.admin.to_bytes(),
        &[authority_bump],
    ];

    let signer_seeds = &[&authority_seeds[..]];

    // transfer token from prize pool to user
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
        prize_amount * 10u64.pow(6),
    )?;

    // add winner to claimed list
    let pool = &mut ctx.accounts.pool;
    pool.claimed_list.push(ctx.accounts.depositor.key());

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawPrize<'info> {
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
        init_if_needed,
        payer = depositor,
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
