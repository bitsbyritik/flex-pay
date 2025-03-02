import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

const JUPITER_QUOTE_API = "https://api.jup.ag/swap/v1/quote";
const JUPITER_SWAP_API = "https://api.jup.ag/swap/v1/swap";

export async function POST(req: NextRequest) {
  try {
    const { paymentLinkId, payerWallet } = await req.json();

    if (!paymentLinkId || !payerWallet) {
      return NextResponse.json({
        status: 400,
        error: "Missing input fields",
      });
    }
    const paymentLink = await prisma.paymentLink.findUnique({
      where: {
        id: paymentLinkId,
      },
      include: {
        merchant: true,
      },
    });

    if (!paymentLink || paymentLink.status !== "ACTIVE") {
      return NextResponse.json({
        status: 400,
        error: "Paymen Link Expired or not valid",
      });
    }

    const amount = paymentLink?.amount;
    const merchantWallet = paymentLink.merchant.walletAddress;
    let merchantTokenAccount;
    try {
      const USDC_MINT = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      );

      const merchantPublicKey = new PublicKey(merchantWallet);
      merchantTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        merchantPublicKey,
      );

      console.log(
        "Merchant USDC Account Exists:",
        merchantTokenAccount.toBase58(),
      );
    } catch (err) {
      console.error("Merchant USDC account does not exist");
      return NextResponse.json({
        status: 400,
        error: "merchant does not have usdc account",
      });
    }

    console.log("Amount in DB", amount);
    console.log("Amount in lamport", Math.round(amount * 10 ** 6));

    const quoteResponse = await axios.get(JUPITER_QUOTE_API, {
      params: {
        inputMint: "So11111111111111111111111111111111111111112",
        outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        amount: Math.round(amount * 10 ** 6),
        slippageBps: 50,
        //userPublicKey: payerWallet.toString(),
        //wrapAndUnwrapSol: true,
        //dynamicComputeUnitLimit: true,
        restrictIntermediateTokens: true,
      },
    });

    const swapResponse = await (
      await fetch(JUPITER_SWAP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'x-api-key': '' // enter api key here
        },
        body: JSON.stringify({
          quoteResponse: quoteResponse.data,
          userPublicKey: payerWallet.toString(),
          destinationTokenAccount: merchantTokenAccount.toBase58(),
          // ADDITIONAL PARAMETERS TO OPTIMIZE FOR TRANSACTION LANDING
          // See next guide to optimize for transaction landing
          dynamicComputeUnitLimit: true,
          dynamicSlippage: true,
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
              maxLamports: 1000000,
              priorityLevel: "veryHigh",
            },
          },
        }),
      })
    ).json();

    const swapData = swapResponse;
    if (!swapData || !swapData.swapTransaction) {
      return NextResponse.json(
        { error: "Transaction Failed!" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.create({
      data: {
        paymentLinkId: paymentLinkId,
        merchantId: paymentLink.merchantId,
        paidToken: "So11111111111111111111111111111111111111112",
        amount: amount,
        payerAddress: payerWallet,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      swapTransaction: swapData.swapTransaction,
    });
  } catch (err) {
    console.error(
      "error processing payment",
      err,
      err.response?.data || err.message,
    );
    return NextResponse.json(
      { error: "Payment server is not working!" },
      { status: 500 },
    );
  }
}
