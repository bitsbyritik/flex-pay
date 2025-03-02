import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "./ui/button";
import Link from "next/link";

export function LandingPage() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-700 from-neutral-600 to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Flex-Pay, <br /> The Non-Custodial Payment Solution for Seamless
        Transaction.
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg dark:text-neutral-700 text-neutral-400 text-center">
        Get the best payment solution for businesses, creators, and
        entrepreneurs—fast, secure, and non-custodial with Flex-Pay!
      </p>
      <Link href={"/register"}>
        <Button className="relative mt-4 cursor-pointer px-8 py-[1.4rem] text-lg font-bold">
          Get Started
        </Button>
      </Link>
    </BackgroundLines>
  );
}
