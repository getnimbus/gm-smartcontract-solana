use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub admin: Pubkey,

    pub mint_token: Pubkey,

    #[max_len(4)]
    pub winner_list: Vec<Pubkey>,

    #[max_len(4)]
    pub claimed_list: Vec<Pubkey>,

    pub expired_time: u64,
}
