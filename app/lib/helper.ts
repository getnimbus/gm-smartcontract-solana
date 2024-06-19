import { Cluster, PublicKey } from "@solana/web3.js";

export const GM_REWARD_ID = new PublicKey(
  "Eja9QQ5rzpFLN35qngz1APcUF6s86tVREVz1WUYitdhm"
);

export function getProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return GM_REWARD_ID;
  }
}
