import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { merchantWallet, amount } = await req.json();

    if (!merchantWallet && !amount) {
      return NextResponse.json({
        status: 400,
        error: "Mising required field",
      });
    }

    const merchant = await prisma.merchant.findUnique({
      where: {
        walletAddress: merchantWallet,
      },
    });

    if (!merchant) {
      return NextResponse.json({
        status: 404,
        error: "Merchant not found!",
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({
        status: 400,
        error: "Invalid amount",
      });
    }

    const paymentLink = await prisma.paymentLink.create({
      data: {
        merchantId: merchant.id,
        amount: parsedAmount,
      },
    });

    console.log(paymentLink);

    return NextResponse.json({
      success: true,
      paymentLinkId: paymentLink.id,
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Error generating Payment Link",
      error: err,
    });
  }
}
