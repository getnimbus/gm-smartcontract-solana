import { Cluster, PublicKey } from "@solana/web3.js";

export const GM_REWARD_ID = new PublicKey(
  "HpaRqapKNdoWUXhWnbzubaoKXADHpY7SBy8b4QpZ5UqM"
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
