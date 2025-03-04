"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GeneratePaymentLink from "@/components/GenrateLink";
import { useMerchantAuth } from "@/hooks/useMerchantAuth";
import { PaymentLinksTable } from "@/components/PaymentLinks";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { loading } = useMerchantAuth();
  const { publicKey } = useWallet();
  const router = useRouter();
  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <div className="font-semibold text-3xl mt-8">Hello!</div>
      <Accordion type="single" collapsible className="w-full mt-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="text-xl mt-4 text-gray-200 font-semibold">
              Create a Payment Link
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <GeneratePaymentLink />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="text-xl mt-4 text-gray-200 font-semibold">
              Check Payment Links
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {publicKey ? (
              <PaymentLinksTable walletAddress={publicKey.toBase58()} />
            ) : (
              <div className="text-red-400">
                Please connect your wallet to view payment links.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="text-xl mt-4 text-gray-200 font-semibold">
              Check Payments
            </div>
          </AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
