use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub admin: Pubkey,

    pub mint_token: Pubkey,

    #[max_len(3)]
    pub winner_list: Vec<Pubkey>,
}
