"use client";

import { SVGProps, useEffect, useState } from "react";
import { Button } from "../ui/button";
import ConnectWalletButton from "../connect-wallet-button";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Header() {
  // const darkmModeStorage = localStorage.getItem("Dark Mode") ?? false;
  const [darkMode, setDarkMode] = useState(false);
  // const { connected, connect, publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("Dark Mode", "light");
    } else {
      localStorage.setItem("Dark Mode", "dark");
    }
  }, [darkMode]);

  // console.log({ darkmModeStorage });

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-gray-100 dark:bg-gray-900 border-b">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">GM Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
        >
          <SunMoonIcon className="w-5 h-5" />
          <span className="sr-only">Toggle dark mode</span>
        </Button>

        {/* <ConnectWalletButton /> */}

        {/* {!walletConnected ? (
          <Button variant="outline" size="sm">
            <WalletIcon className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <WalletIcon className="w-4 h-4 mr-2" />
            Wallet Connected
          </Button>
        )} */}
      </div>
    </header>
  );
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
  );
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
  );
}
