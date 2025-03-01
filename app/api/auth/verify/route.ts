import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    /* if (!walletAddress && !signature) {
      return new NextResponse(
        JSON.stringify({
          status: 400,
          message: "Missing walletAddress & signature",
        }),
      );
    } */

    const merchant = await prisma.merchant.findUnique({
      where: { walletAddress },
    });

    return NextResponse.json({ isMerchant: !!merchant });
  } catch (err) {
    return NextResponse.json({
      status: 400,
      error: err,
    });
  }
}
