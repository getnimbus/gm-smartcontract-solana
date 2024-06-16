import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { GmContract } from "../target/types/gm_contract";
import { assert } from "chai";
import {
  ASSOCIATED_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@coral-xyz/anchor/dist/cjs/utils/token";
import { mintToken } from "./utils";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

// @ts-ignore
BN.prototype.sqrt = function sqrt() {
  var z = new BN(0);
  if (this.gt(new BN(3))) {
    z = this;
    var x = this.div(new BN(2)).add(new BN(1));
    while (x.lt(z)) {
      z = x;
      x = this.div(x).add(x).div(new BN(2));
    }
  } else if (!this.eq(new BN(0))) {
    z = new BN(1);
  }
  return z;
};

describe("withdraw-prize", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GmContract as Program<GmContract>;

  const payer = anchor.web3.Keypair.generate();
  const winner = anchor.web3.Keypair.generate();
  const mintTokenDecimals = 6;

  let poolPda: anchor.web3.PublicKey;
  let poolAuthorityPda: anchor.web3.PublicKey;

  let mintTokenKp: anchor.web3.Keypair;

  let poolAccount: anchor.web3.PublicKey;

  let depositorAccount: anchor.web3.PublicKey;
  let winnerAccount: anchor.web3.PublicKey;

  beforeEach(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        payer.publicKey,
        anchor.web3.LAMPORTS_PER_SOL * 2
      )
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        winner.publicKey,
        anchor.web3.LAMPORTS_PER_SOL * 2
      )
    );

    poolPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), payer.publicKey.toBuffer()],
      program.programId
    )[0];

    poolAuthorityPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("authority"), payer.publicKey.toBuffer()],
      program.programId
    )[0];

    mintTokenKp = anchor.web3.Keypair.generate();

    await mintToken({
      connection: provider.connection,
      payer: payer,
      receiver: payer.publicKey,
      mint: mintTokenKp,
      decimals: 6,
      amount: 1000,
    });

    poolAccount = getAssociatedTokenAddressSync(
      mintTokenKp.publicKey,
      poolAuthorityPda,
      true
    );

    depositorAccount = getAssociatedTokenAddressSync(
      mintTokenKp.publicKey,
      payer.publicKey,
      false
    );

    winnerAccount = getAssociatedTokenAddressSync(
      mintTokenKp.publicKey,
      winner.publicKey,
      false
    );

    const tx1 = await program.methods
      .createPool()
      .accounts({
        pool: poolPda,
        admin: payer.publicKey,
        poolAuthority: poolAuthorityPda,
        mintToken: mintTokenKp.publicKey,
        poolAccount: poolAccount,

        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    console.log("Create pool transaction signature", tx1);

    const winnerList = [
      winner.publicKey,
      new PublicKey("6Nu9WYbDkGP6BBdYtRncPdDyQMT8QCRqr2jABPb9SpZQ"),
      new PublicKey("7pni3obgpjLCaDDswVsP1wDoUqDyCrvFesFESrAYwjo3"),
    ];

    const amount = new BN(100 * 10 ** mintTokenDecimals);

    const expired_time = new BN(100000); // by seconds

    const tx2 = await program.methods
      .depositPrize(winnerList, amount, expired_time)
      .accounts({
        pool: poolPda,
        poolAuthority: poolAuthorityPda,
        depositor: payer.publicKey,
        mintToken: mintTokenKp.publicKey,
        poolAccount: poolAccount,
        depositorAccount: depositorAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    console.log("Deposit prize transaction signature", tx2);
  });

  it("withdraw-prize", async () => {
    let data = await program.account.pool.fetch(poolPda);
    assert.isTrue(
      data.winnerList
        .map((item) => item.toString())
        .includes(winner.publicKey.toBase58()),
      "Winner is in list"
    );

    try {
      const tx = await program.methods
        .withdrawPrize()
        .accounts({
          pool: poolPda,
          poolAuthority: poolAuthorityPda,
          depositor: winner.publicKey,
          mintToken: mintTokenKp.publicKey,
          poolAccount: poolAccount,
          depositorAccount: winnerAccount,

          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([winner])
        .rpc();

      console.log("Your transaction signature", tx);
    } catch (err) {
      console.error(err);
    }

    data = await program.account.pool.fetch(poolPda);
    console.log(data.winnerList);
    assert.isFalse(
      data.winnerList
        .map((item) => item.toString())
        .includes(winner.publicKey.toBase58()),
      "Winner redeemed prize"
    );
  });
});
