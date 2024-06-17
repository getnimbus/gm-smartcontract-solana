/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ImuGKIZRL9f
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { JSX, SVGProps, useState } from "react"
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Component() {
  const { handleSubmit } = useForm()
  const onSubmit = (data: any) => {
    alert(
      `Deposit Amount: ${data.depositAmount}\nWinner 1: ${data.winner1}\nWinner 2: ${data.winner2}\nWinner 3: ${data.winner3}\nExpired Time: ${data.expiredTime}`,
    )
  }
  const [expiredDate, setExpiredDate] = useState(new Date())
  const [walletConnected, setWalletConnected] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const handleClaimReward = () => {
    alert("Hello world")
  }
  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "dark" : ""}`}>
      <header className="flex items-center justify-between h-16 px-4 bg-gray-100 dark:bg-gray-900 border-b">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">GM Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            <SunMoonIcon className="w-5 h-5" />
            <span className="sr-only">Toggle dark mode</span>
          </Button>
          {!walletConnected ? (
            <Button variant="outline" size="sm" onClick={() => setWalletConnected(true)}>
              <WalletIcon className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              <WalletIcon className="w-4 h-4 mr-2" />
              Wallet Connected
            </Button>
          )}
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Claim the reward</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Click the button below to check if you are eligible to claim your reward.
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
      {walletConnected && (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Card className="w-full max-w-2xl p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Claim Reward</h2>
              <p className="text-gray-500 dark:text-gray-400">Click the button below to claim your reward.</p>
            </div>
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
  )
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
  )
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
  )
}


function MoonIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}


function SunMoonIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.3 17.7-1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
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