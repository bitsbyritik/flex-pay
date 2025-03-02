"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useMerchantAuth = () => {
  const { publicKey, connected, signMessage } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authenticateMerchant = async () => {
      if (!publicKey || !connected) return;

      setLoading(true);
      try {
        //TODO: adding nonce for security but some issue in backedn do it later

        /*   const { data } = await axios.get("/api/auth/nonce", {
          params: { walletAddress: publicKey.toBase58() },
        });

        const nonce = data.nonce;
        const message = new TextEncoder().encode(nonce);

        if (!signMessage) {
          console.error("Signing Failed!");
          return;
        }

        const signedMessage = await signMessage?.(message);
        const signature = bs58.encode(signedMessage);
       */

        const res = await axios.post("/api/auth/verify", {
          walletAddress: publicKey.toBase58(),
          // signature,
        });

        if (res.data.isMerchant) {
          router.push("/dashboard");
        } else {
          router.push("/register");
        }
      } catch (error) {
        console.error("Authentication err: ", error);
        router.push("/register");
      } finally {
        setLoading(false);
      }

      useEffect(() => {
        authenticateMerchant();
      }, [authenticateMerchant]);
    };
  }, [publicKey, connected, signMessage, router]);

  return { loading };
};
