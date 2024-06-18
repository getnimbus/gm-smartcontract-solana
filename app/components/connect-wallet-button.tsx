"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const WalletMultiButtonDynamic = dynamic(
  async () => {
    return (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton;
  },
  { ssr: false }
);

export default function ConnectWalletButton() {
  return <WalletMultiButtonDynamic className={cn(buttonVariants())} />;
}
