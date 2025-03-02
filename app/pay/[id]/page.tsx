"use client";

import { PaymentFailed } from "@/components/PaymentFailed";
import { PaymentSuccess } from "@/components/PaymentSuccess";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PayPage() {
  const [connect, setConnect] = useState(false);
  const { publicKey, connected, signTransaction } = useWallet();

  const { connection } = useConnection();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);

  useEffect(() => {
    if (!publicKey || !connected) {
      setConnect(false);
    } else {
      setConnect(true);
    }
  }, [publicKey, connected]);

  const handlePayment = async () => {
    try {
      if (!publicKey) throw new Error("Wallet not connected");

      if (!signTransaction) {
        throw new Error("Wallet does not support");
      }
      setLoading(true);
      const swapResponse = await axios.post("/api/pay", {
        payerWallet: publicKey?.toBase58(),
        paymentLinkId: id,
      });

      if (!swapResponse.data.swapTransaction) {
        throw new Error("Failed to fetch Transaction");
      }

      const transaction = VersionedTransaction.deserialize(
        Buffer.from(swapResponse.data.swapTransaction, "base64"),
      );
      console.log("Transaction Details:", transaction);
      const signedTransaction = await signTransaction(transaction);
      console.log("Signed Transaction:", signedTransaction);
      //const serializedTx = signedTransaction.serialize();
      //
      const txSignature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          maxRetries: 2,
          skipPreflight: true,
        },
      );
      console.log("Transaction Sent: ", txSignature);

      await axios.post("/api/payment/confirm", {
        paymentLinkId: id,
        transactionSign: txSignature,
        payerAddress: publicKey.toBase58(),
      });

      setPaymentStatus("success");
    } catch (err) {
      console.error("Payment Failed!");
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === "success") {
    return <PaymentSuccess />;
  }

  if (paymentStatus === "failed") {
    return <PaymentFailed />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Flex Pay</CardTitle>
          <CardDescription>Pay using Flex Pay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center">
            {!connect ? (
              <WalletMultiButton />
            ) : (
              <div className="gap-2 flex flex-col mt-4">
                <Button
                  className="py-6 px-20 text-lg font-bold"
                  onClick={handlePayment}
                >
                  {loading ? "Paying..." : "Pay"}
                </Button>
                <WalletDisconnectButton />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
