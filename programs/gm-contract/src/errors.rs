use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Invalid winner list")]
    InvalidWinnerList,

    #[msg("Invalid prize amount")]
    InvalidPrizeAmount,

    #[msg("Deposit not enough")]
    DepositNotEnough,

    #[msg("Prize already claim")]
    PrizeAlreadyClaim,

    #[msg("Not winner")]
    NotWinner,

    #[msg("Not winner")]
    PoolBalanceNotEnough,

    #[msg("Invalid expired time")]
    InvalidExpiredTime,

    #[msg("Invalid authority")]
    InvalidAuthority,
}
