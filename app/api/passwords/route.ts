import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, username, url, notes, ciphertext, iv, ownerAddress } = body;

    if (!title || !ciphertext || !iv || !ownerAddress || !username || !url) {
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
        ownerAddress,
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
  const { searchParams } = new URL(req.url);
  const ownerAddress = searchParams.get("ownerAddress");

  if (!ownerAddress) {
    return NextResponse.json({ error: "ownerAddress is missing" }, { status: 400 });
  }

  const entries = await prisma.passwordEntry.findMany({
    where: { ownerAddress },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(entries, { status: 200 });
}
