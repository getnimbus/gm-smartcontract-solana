import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import path from "path";
import { Keypair } from "@solana/web3.js"; // Adjust the import according to your actual Keypair source

// Function to load Keypair from a file
function loadKeypairFromFile(filename: string): Keypair {
  const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { filename } = req.body;

    if (!filename) {
      res.status(400).json({ error: "Filename is required" });
      return;
    }

    try {
      const filePath = path.join(
        process.cwd(),
        "path-to-your-directory",
        filename
      );
      const keypair = loadKeypairFromFile(filePath);
      res.status(200).json({ keypair });
    } catch (error) {
      res.status(500).json({
        error: "Failed to load keypair",
        details: error,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
