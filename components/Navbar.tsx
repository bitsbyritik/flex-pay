"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export const NavbarComponent = () => {
  const { connected, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = async () => {
    if (connected) {
      await disconnect();
      return;
    }

    setVisible(true);
  };

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">FLEX Pay</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Github
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button onClick={handleConnect} variant="outline">
            {connected ? "Disconnect Wallet" : "Connect Wallet"}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
