"use client";

import HomePageShowComponent from "@/components/HomePageShow";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div>
      {isConnected ? (
        <div>
          <HomePageShowComponent />
        </div>
      ) : (
        <div>Please connect a wallet to continue...</div>
      )}
    </div>
  );
}
