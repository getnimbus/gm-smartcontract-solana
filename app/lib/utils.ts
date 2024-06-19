import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as anchor from "@coral-xyz/anchor";
import {
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const expectRevert = async (promise: Promise<any>) => {
  try {
    await promise;
    throw new Error("Expected a revert");
  } catch {
    return;
  }
};

export async function fetchKeypair(filename: string) {
  try {
    const response = await fetch("/api/load-keypair", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename }),
    });

    return response.json();
  } catch (error) {
    console.log("read file error: ", error);
  }
}
