import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware/requireAuth";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if ("status" in authResult) return authResult; // Invalid token

    const { address } = authResult;
    const body = await req.json();

    const { title, username, url, notes, ciphertext, iv } = body;

    if (!title || !ciphertext || !iv || !username || !url) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const entry = await prisma.passwordEntry.create({
      data: {
        title,
        username,
        url,
        notes,
        ciphertext,
        iv,
        ownerAddress: address, // from JWT
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating password entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if ("status" in authResult) return authResult; // Invalid token

  const { address } = authResult;

  const entries = await prisma.passwordEntry.findMany({
    where: { ownerAddress: address },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries, { status: 200 });
}
