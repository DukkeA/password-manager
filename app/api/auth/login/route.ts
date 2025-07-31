// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cryptoWaitReady, signatureVerify } from "@polkadot/util-crypto";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { address, signature } = await req.json();
  const message = "login-password-manager";
  const hexMessage = `0x${Buffer.from(message).toString("hex")}`;

  await cryptoWaitReady();

  const result = signatureVerify(hexMessage, signature, address);
  if (!result.isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const token = jwt.sign({ address }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return NextResponse.json({ token });
}
