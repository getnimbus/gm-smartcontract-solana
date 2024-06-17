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
import { Keypair } from "@solana/web3.js";
import fs from "fs";

function loadKeypairFromFile(filename: string): Keypair {
  const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

describe("create-pool", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GmContract as Program<GmContract>;

  const payer = anchor.web3.Keypair.generate();
  // const payer = loadKeypairFromFile("/Users/mac/.config/solana/id.json");

  let poolPda: anchor.web3.PublicKey;
  let poolAuthorityPda: anchor.web3.PublicKey;

  let mintTokenKp: anchor.web3.Keypair;

  let poolAccount: anchor.web3.PublicKey;

  beforeEach(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        payer.publicKey,
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

    console.log("Mint token address", mintTokenKp.publicKey.toBase58());

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
  });

  it("create-pool", async () => {
    try {
      const tx = await program.methods
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

      console.log("Your transaction signature", tx);
    } catch (err) {
      console.error(err);
    }

    const data = await program.account.pool.fetch(poolPda);

    assert(
      data.mintToken.toBase58() === mintTokenKp.publicKey.toBase58(),
      "Correct mint token"
    );

    assert(
      data.admin.toBase58() === payer.publicKey.toBase58(),
      "Correct admin"
    );
  });
});
