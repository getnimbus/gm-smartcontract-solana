use anchor_lang::prelude::*;

mod errors;
mod instructions;
mod state;

declare_id!("Ay6NVBNkzTkTXduiF6yFybfcipAjXriYr17LL8edb6YE");

#[program]
pub mod gm_contract {
    pub use super::instructions::*;

    use super::*;

    pub fn create_pool(ctx: Context<CreatePool>) -> Result<()> {
        instructions::create_pool(ctx)
    }

    pub fn deposit_prize(ctx: Context<DepositPrize>, data: Vec<Pubkey>, amount: u64) -> Result<()> {
        instructions::deposit_prize(ctx, data, amount)
    }

    // pub fn withdraw_prize(ctx: Context<WithdrawPrize>, amount: u64) -> Result<()> {
    //     instructions::withdraw_prize(ctx, amount)
    // }
}
