import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { GmContract, IDL } from "../../target/types/gm_contract";
import { Cluster, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getProgramId } from "./helper";
import { BN } from "bn.js";
import {
  ASSOCIATED_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@coral-xyz/anchor/dist/cjs/utils/token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert } from "chai";
import { fetchKeypair } from "./utils";

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

export default class GmContractProgram {
  program: Program<GmContract>;
  provider: AnchorProvider;
  mintTokenKp: anchor.web3.PublicKey;

  constructor(provider: AnchorProvider, cluster: Cluster = "devnet") {
    this.provider = provider;
    this.program = new Program(
      IDL,
      process.env.NEXT_PUBLIC_PROGRAM_ID!,
      provider
    );
    this.mintTokenKp = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_ADDRESS!);
  }

  async createPool(publicKey: PublicKey) {
    //   const payer = anchor.web3.Keypair.generate();
    const payer = await fetchKeypair("/Users/toanho/.config/solana/id.json");
    let poolPda: anchor.web3.PublicKey;
    let poolAuthorityPda: anchor.web3.PublicKey;

    let poolAccount: anchor.web3.PublicKey;

    poolPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), publicKey.toBuffer()],
      this.program.programId
    )[0];

    poolAuthorityPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("authority"), publicKey.toBuffer()],
      this.program.programId
    )[0];

    poolAccount = getAssociatedTokenAddressSync(
      this.mintTokenKp,
      poolAuthorityPda,
      true
    );

    const tx = await this.program.methods.createPool().accounts({
      pool: poolPda,
      admin: payer.publicKey,
      poolAuthority: poolAuthorityPda,
      mintToken: this.mintTokenKp,
      poolAccount: poolAccount,

      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    });
    console.log("Your transaction signature", tx);

    return tx.transaction();
  }

  async depositPrize(
    publicKey: PublicKey,
    listWinner: string[],
    amountPrize: string
  ) {
    const mintTokenDecimals = 6;

    let poolPda: anchor.web3.PublicKey;
    let poolAuthorityPda: anchor.web3.PublicKey;

    let poolAccount: anchor.web3.PublicKey;

    let depositorAccount: anchor.web3.PublicKey;

    poolPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), publicKey.toBuffer()],
      this.program.programId
    )[0];

    poolAuthorityPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("authority"), publicKey.toBuffer()],
      this.program.programId
    )[0];

    poolAccount = getAssociatedTokenAddressSync(
      this.mintTokenKp,
      poolAuthorityPda,
      true
    );

    depositorAccount = getAssociatedTokenAddressSync(
      this.mintTokenKp,
      publicKey,
      false
    );

    const winnerList = listWinner.map((item) => new PublicKey(item));

    const amount = new BN(Number(amountPrize) * 10 ** mintTokenDecimals); // input

    console.log({ amount: amount.toString(), amountPrize });

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL!,
      "processed"
    );
    const slot = (await connection.getSlot()) + 1_000_000; // expired_time
    const expiredTime = new BN(slot);

    console.log("code us run");

    const tx = this.program.methods
      .depositPrize(winnerList, amount, expiredTime)
      .accounts({
        pool: poolPda,
        poolAuthority: poolAuthorityPda,
        depositor: publicKey,
        mintToken: this.mintTokenKp,
        poolAccount: poolAccount,
        depositorAccount: depositorAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      });

    console.log("Your transaction signature", tx);

    return tx.transaction();
  }

  async withDrawPrize(publicKey: PublicKey) {
    let poolPda: anchor.web3.PublicKey;
    let poolAuthorityPda: anchor.web3.PublicKey;

    let poolAccount: anchor.web3.PublicKey;

    let depositorAccount: anchor.web3.PublicKey;

    let adminKey = new PublicKey(process.env.NEXT_PUBLIC_ADMIN_ADDRESS!);

    poolPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), adminKey.toBuffer()],
      this.program.programId
    )[0];

    poolAuthorityPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("authority"), adminKey.toBuffer()],
      this.program.programId
    )[0];

    poolAccount = getAssociatedTokenAddressSync(
      this.mintTokenKp,
      poolAuthorityPda,
      true
    );

    depositorAccount = getAssociatedTokenAddressSync(
      this.mintTokenKp,
      publicKey,
      false
    );

    const tx = this.program.methods.withdrawPrize().accounts({
      pool: poolPda,
      poolAuthority: poolAuthorityPda,
      depositor: publicKey,
      mintToken: this.mintTokenKp,
      poolAccount: poolAccount,
      depositorAccount: depositorAccount,

      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    });

    console.log("transaction: ", tx);

    return tx.transaction();
  }

  async viewUserReward() {
    let adminKey = new PublicKey(process.env.NEXT_PUBLIC_ADMIN_ADDRESS!);

    const poolPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), adminKey.toBuffer()],
      this.program.programId
    )[0];
    return await this.program.account.pool.fetch(poolPda);
  }
}
