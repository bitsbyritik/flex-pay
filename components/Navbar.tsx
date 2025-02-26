"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const Navbar = () => {
  return (
    <nav className="p-4 mx-36 text-white flex justify-between items-center">
      <h1 className="fonr-bold text-xl">FLexPay</h1>
      <WalletMultiButton />
    </nav>
  );
};
