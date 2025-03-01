import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const walletAddress = searchParams.get("walletAddress");

  if (!walletAddress) {
  }

  const nonce = randomBytes(10).toString("hex");

  return NextResponse.json(nonce);
}
