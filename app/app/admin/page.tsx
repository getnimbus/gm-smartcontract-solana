"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aycCU8cdFET
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { useWallet } from "@solana/wallet-adapter-react";
import { JSX, SVGProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import GmContractProgram from "@/lib/gm-contract-program";
import useAnchorProvider from "@/hooks/use-anchor-provider";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Component() {
  const solanaWallet = useWallet();
  const provider = useAnchorProvider();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const keyData = Object.keys(data).filter(
      (item) => item !== "depositAmount"
    );
    const amount = data.depositAmount;
    const listWinner = keyData.map((key) => data[key]);

    signDepositPrize(listWinner, amount);
  };

  // const { isPending: isPendingDepositPrize, mutateAsync: signDepositPrize } =
  //   useMutation({
  //     mutationKey: ["deposit-prize", provider.publicKey],
  //     mutationFn: async (listWinner: string[], amountDeposist: string) => {
  //       if (solanaWallet.publicKey) {
  //         const program = new GmContractProgram(provider);
  //         console.log({ amountDeposist });
  //         const tx = await program.depositPrize(
  //           solanaWallet.publicKey,
  //           listWinner,
  //           amountDeposist
  //         );
  //         const signature = await provider.sendAndConfirm(tx);
  //         console.log({ tx, signature });

  //         return signature;
  //       }
  //     },
  //     onSuccess: async (tx) => {},
  //     onError: (error) => {},
  //     onSettled: () => {},
  //   });

  const signDepositPrize = async (
    listWinner: string[],
    amountDeposist: string
  ) => {
    try {
      if (solanaWallet.publicKey) {
        const program = new GmContractProgram(provider);
        const tx = await program.depositPrize(
          solanaWallet.publicKey,
          listWinner,
          amountDeposist
        );
        const signature = await provider.sendAndConfirm(tx);
        console.log({ tx, signature });

        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "success",
          title: "Success",
          description: (
            <>
              Deposit pool prize successfully{" "}
              <Button variant="link">
                <a target="_blank" href={`https://explorer.solana.com/tx/}`}>
                  View Txn
                </a>
              </Button>
            </>
          ),
        });

        return signature;
      }
    } catch (error: any) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (
      solanaWallet.publicKey?.toBase58() &&
      solanaWallet.publicKey?.toBase58() !==
        process.env.NEXT_PUBLIC_ADMIN_ADDRESS
    ) {
      return redirect("/");
    }
  }, [solanaWallet.publicKey]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Deposit Pool Prize</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter the deposit amount and winner wallet addresses.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="deposit-amount" className="flex items-center">
                  <DollarSignIcon className="w-4 h-4 mr-2" />
                  Deposit Amount
                </Label>
                <Input
                  {...register("depositAmount")}
                  type="number"
                  placeholder="Minimum deposit $80"
                  min="80"
                  required
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="winner-1" className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  1st Winner
                </Label>
                <Input
                  {...register("winner1")}
                  placeholder="Enter 1st winner wallet address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="winner-2" className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  2nd Winner
                </Label>
                <Input
                  {...register("winner2")}
                  placeholder="Enter 2nd winner wallet address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="winner-3" className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  3rd Winner
                </Label>
                <Input
                  {...register("winner3")}
                  placeholder="Enter 3rd winner wallet address"
                  required
                />
              </div>
              <div className="mt-4">
                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

function DollarSignIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function TrophyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
