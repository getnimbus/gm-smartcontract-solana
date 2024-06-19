import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import Provider from "./provider";
import "./globals.css";
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GM Point Reward",
  description: "Claim GM Point",
  // icons: {
  //   icon: [
  //     {
  //       media: "(prefers-color-scheme: light)",
  //       url: "/images/icon-light.png",
  //       href: "/images/icon-light.png",
  //     },
  //     {
  //       media: "(prefers-color-scheme: dark)",
  //       url: "/images/icon.png",
  //       href: "/images/icon-dark.png",
  //     },
  //   ],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main className="min-h-screen">
            <Header />
            <div className="h-[85vh]">{children}</div>
            <footer className="bg-gray-100 dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400 h-[5vh]">
              &copy; 2024 Nimbus Inc
            </footer>
          </main>
        </Provider>
      </body>
    </html>
  );
}
