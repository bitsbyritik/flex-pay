import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    const existingMerchant = await prisma.merchant.findUnique({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (existingMerchant) {
      return NextResponse.json({ message: "User Already exists" });
    }

    const newMerchant = await prisma.merchant.create({
      data: {
        walletAddress: walletAddress,
        approved: true,
      },
    });
    return NextResponse.json({ message: "Merchant created", success: true });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      error: "Failed to create a merchant",
    });
  }
}
