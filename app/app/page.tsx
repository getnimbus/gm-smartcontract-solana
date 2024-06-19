"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ImuGKIZRL9f
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { JSX, SVGProps, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import useAnchorProvider from "@/hooks/use-anchor-provider";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import GmContractProgram from "@/lib/gm-contract-program";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Component() {
  const solanaWallet = useWallet();
  const provider = useAnchorProvider();
  const queryClient = useQueryClient();
  const [userDidntClaimedYet, setUserDidntClaimedYet] = useState(false);
  const [userChecked, setUserChecked] = useState(false);

  const { data: userEvent, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["view-user-reward", provider.publicKey],
    queryFn: async () => {
      if (provider.publicKey) {
        const program = new GmContractProgram(provider);
        const event = await program.viewUserReward();
        return event;
      }
    },
  });

  const { toast } = useToast();

  const checkUserIsClaimed = () => {
    if (userEvent) {
      setUserChecked(true);
      const userClaimed = userEvent.claimedList.map((item) => item.toBase58());
      const winnerList = userEvent.winnerList.map((item) => item.toBase58());
      const userAddress = solanaWallet.publicKey?.toBase58() ?? "";
      const isClaimable =
        winnerList.includes(userAddress) && !userClaimed.includes(userAddress);

      if (isClaimable) {
        setUserDidntClaimedYet(true);
      } else {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          variant: "destructive",
          title: "Error",
          description:
            "You are not eligible to claim the reward or it has already been",
        });
      }
    }
  };

  const { isPending: isPendingWithdrawPrize, mutateAsync: signWithdrawPrize } =
    useMutation({
      mutationKey: ["withdraw-prize", provider.publicKey],
      mutationFn: async () => {
        try {
          if (solanaWallet.publicKey) {
            const program = new GmContractProgram(provider);
            const tx = await program.withDrawPrize(solanaWallet.publicKey);
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
                  Claim successfully
                  <Button variant="link">
                    <a
                      target="_blank"
                      href={`https://explorer.solana.com/tx/}`}
                    >
                      View Txn
                    </a>
                  </Button>
                </>
              ),
            });

            setUserDidntClaimedYet(false);
            queryClient.invalidateQueries({
              queryKey: ["view-user-reward", provider.publicKey],
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
      },
    });

  useEffect(() => {
    if (
      solanaWallet.publicKey?.toBase58() &&
      solanaWallet.publicKey?.toBase58() ===
        process.env.NEXT_PUBLIC_ADMIN_ADDRESS
    ) {
      return redirect("/admin");
    }
  }, [solanaWallet.publicKey]);

  return (
    <div className="flex flex-col h-full">
      {!solanaWallet.connected || !userEvent ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Card className="w-full max-w-2xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Claim Reward</h2>
              <p className="text-purple-500 dark:text-purple-400">
                You Have to connect your wallet first!
              </p>
            </div>
          </Card>
        </div>
      ) : userDidntClaimedYet ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Card className="w-full max-w-2xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Claim Reward</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Click the button below to claim your reward.
              </p>
            </div>
            <Button className="w-full" onClick={() => signWithdrawPrize()}>
              <AwardIcon className="w-4 h-4 mr-2" />
              Claim Reward
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Card className="w-full max-w-2xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Claim the reward</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Please click the button below to check if you are eligible to
                claim your reward.
              </p>
            </div>
            <Button className="w-full" onClick={checkUserIsClaimed}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Check eligible
            </Button>
            {/* {userChecked && !userDidntClaimedYet && (
              <p className="text-red-500 text-center">
                You are not eligible to claim the reward or it has already been
                claimed.
              </p>
            )} */}
          </Card>
        </div>
      )}
    </div>
  );
}

function AwardIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
