"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ImuGKIZRL9f
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { JSX, SVGProps, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Component() {
  const { handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    alert(
      `Deposit Amount: ${data.depositAmount}\nWinner 1: ${data.winner1}\nWinner 2: ${data.winner2}\nWinner 3: ${data.winner3}\nExpired Time: ${data.expiredTime}`
    );
  };
  const [expiredDate, setExpiredDate] = useState(new Date());
  const [walletConnected, setWalletConnected] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const handleClaimReward = () => {
    alert("Hello world");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {walletConnected ? (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Card className="w-full max-w-2xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Claim Reward</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Click the button below to claim your reward.
              </p>
            </div>
            <Button className="w-full" onClick={handleClaimReward}>
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
                Click the button below to check if you are eligible to claim
                your reward.
              </p>
            </div>
            <Button className="w-full">
              <CheckIcon className="w-4 h-4 mr-2" />
              Check eligible
            </Button>
            <Button className="w-full" onClick={handleClaimReward}>
              <AwardIcon className="w-4 h-4 mr-2" />
              Claim Reward
            </Button>
          </Card>
        </div>
      )}
      <footer className="bg-gray-100 dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 Nimbus Inc
      </footer>
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
