use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Invalid mint")]
    InvalidMint,

    #[msg("Deposit too small")]
    DepositTooSmall,

    #[msg("Invariant violated")]
    InvariantViolated,

    #[msg("Invalid authority")]
    InvalidAuthority,
}
