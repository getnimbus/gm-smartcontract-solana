"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aycCU8cdFET
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { JSX, SVGProps } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "@/components/connect-wallet-button";

export default function Component() {
  const { register, handleSubmit } = useForm();
  const { connected, connect,  publicKey, sendTransaction } = useWallet();

  const onSubmit = (data: any) => {
    console.log(data);
    alert(
      `Deposit Amount: ${data.depositAmount}\nWinner 1: ${data.winner1}\nWinner 2: ${data.winner2}\nWinner 3: ${data.winner3}`,
    )
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between h-16 px-4 bg-gray-100 dark:bg-gray-900 border-b">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">GM Dashboard</h1>
        </div>

        <ConnectWalletButton />
      </header>
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Deposit Pool Prize</h2>
            <p className="text-gray-500 dark:text-gray-400">Enter the deposit amount and winner wallet addresses.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="deposit-amount" className="flex items-center">
                  <DollarSignIcon className="w-4 h-4 mr-2" />
                  Deposit Amount
                </Label>
                <Input {...register("depositAmount")} type="number" placeholder="Enter deposit amount" min="1" required />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="winner-1" className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  1st Winner
                </Label>
                <Input {...register("winner1")} placeholder="Enter 1st winner wallet address" required />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="winner-2" className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  2nd Winner
                </Label>
                <Input {...register("winner2")} placeholder="Enter 2nd winner wallet address" required />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <Label htmlFor="winner-3" className="flex items-center">
                  <TrophyIcon className="w-4 h-4 mr-2" />
                  3rd Winner
                </Label>
                <Input {...register("winner3")} placeholder="Enter 3rd winner wallet address" required />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">

                <Label htmlFor="expired-time" className="flex items-center">
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  Expired Time
                </Label>
                {/* TODO: add date picker here */}
                <Input {...register("expiredTime")} placeholder="Enter expired time" required />
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
      <footer className="bg-gray-100 dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2024 Nimbus Inc
      </footer>
    </div>
  )
}

function DollarSignIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
  )
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
  )
}


function WalletIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

function CalendarDaysIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}
