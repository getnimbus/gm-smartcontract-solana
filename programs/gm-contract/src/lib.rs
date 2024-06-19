use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

declare_id!("Eja9QQ5rzpFLN35qngz1APcUF6s86tVREVz1WUYitdhm");

#[program]
pub mod gm_contract {
    pub use super::instructions::*;

    use super::*;

    pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
        instructions::create_pool(ctx)
    }

    pub fn deposit_prize(
        ctx: Context<DepositPrize>,
        data: Vec<Pubkey>,
        amount: u64,
        expired_time: u64,
    ) -> Result<()> {
        instructions::deposit_prize(ctx, data, amount, expired_time)
    }

    pub fn withdraw_prize(ctx: Context<WithdrawPrize>) -> Result<()> {
        instructions::withdraw_prize(ctx)
    }
}
