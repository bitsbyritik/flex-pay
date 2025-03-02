import { prisma } from "@/lib/db";
import { useWallet } from "@solana/wallet-adapter-react";

export const useMerchantId = async () => {
  const { publicKey, connected } = useWallet();

  if (!connected || !publicKey) {
    return null;
  }

  const merchantId = await prisma.merchant.findUnique({
    where: {
      walletAddress: publicKey.toBase58(),
    },
  });

  if (!merchantId) {
    return null;
  }

  return merchantId;
};
