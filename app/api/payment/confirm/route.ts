import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  const connection = new Connection(process.env.NEXT_PUBLIC_ALCHEMY_URL!);

  try {
    const { paymentLinkId, transactionSign, payerAddress } = await req.json();
    if (!paymentLinkId || !transactionSign || !payerAddress) {
      return NextResponse.json({
        status: 400,
        error: "Missing required fields!",
      });
    }

    const txDetails = await connection.getTransaction(transactionSign, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!txDetails || !txDetails.meta) {
      return NextResponse.json({ status: 400, error: "Invalid transaction" });
    }

    if (txDetails.meta.err) {
      return NextResponse.json({ status: 400, error: "Transaction Failed!" });
    }

    const payment = await prisma.payment.findMany({
      where: {
        paymentLinkId,
        payerAddress,
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    if (!payment.length) {
      return NextResponse.json({ status: 400, error: "Payment not found" });
    }

    const latestPayment = payment[0];

    await prisma.payment.update({
      where: {
        id: latestPayment.id,
      },
      data: {
        transactionSign: transactionSign,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ success: true, message: "Payment Completed!" });
  } catch (err) {
    console.error("Error crearing payment!", err);
    return NextResponse.json({ status: 500, error: "Confirmation failed" });
  }
}
