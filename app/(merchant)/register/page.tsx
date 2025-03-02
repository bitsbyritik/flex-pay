"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMerchantAuth } from "@/hooks/useMerchantAuth";

export default function Register() {
  const { connected, publicKey } = useWallet();
  const [popoverOpen, setPopoverOpen] = useState(!connected);
  if (!connected) {
    toast.error("Connect Wallet First");
  }
  const router = useRouter();

  const { loading } = useMerchantAuth();

  useEffect(() => {
    if (connected) {
      setPopoverOpen(false); // Close popover when wallet connects
    } else {
      toast.error("Connect Wallet First");
      setPopoverOpen(true); // Open popover when wallet disconnects
    }
  }, [connected]);

  const registerHandler = async () => {
    const loadingToast = toast.loading("Registering...");

    try {
      axios.post("/api/merchant/create", {
        walletAddress: publicKey?.toBase58(),
      });

      toast.dismiss(loadingToast);

      toast.success("Registeration Successfull");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Registration Failed!");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center">
      {!connected ? (
        <div className="mt-12 p-6 shadow-lg">
          <Card>
            <CardContent className="mt-8 w-96 text-center">
              <p className="mb-2 text-lg font-bold text-red-500">
                Please connect your wallet first!
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-12 p-20 shadow-lg">
          <div className="flex flex-col gap-6">
            <p className="mb-2 text-lg font-bold text-gray-50">
              Register as a Merchant!
            </p>
            <Button
              className="p-6 text-md font-semibold"
              onClick={registerHandler}
            >
              Register Now!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
