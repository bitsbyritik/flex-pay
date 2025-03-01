"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useState } from "react";

export default function GeneratePaymentLink() {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState<number | string>("");

  const generateLink = async () => {
    const parsedAmount = parseFloat(amount as string);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error("Invalid amount");
      return;
    }

    const res = await axios.post("/api/payment/link", {
      merchantWallet: publicKey?.toBase58(),
      amount: parsedAmount,
    });
    if (res.data) {
      setAmount("");
    }

    console.log(res);
  };

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create a Payment Link</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Amount</Label>
                <Input
                  id="amount"
                  value={amount}
                  placeholder="Amount you want to recieve"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                      setAmount(value);
                    }
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={generateLink}>Generate</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
