import { PrismaClient, Profile } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to add an item to your cart");
  }

  try {
    const profiles: Profile[] | null = await prisma.profile.findMany({
      where: { ownerId: userId },
    });
    return NextResponse.json(profiles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to add an item to your cart");
  }

  try {
    const newProfile = await prisma.profile.create({
      data: { ...body, ownerId: userId },
    });
    return NextResponse.json(newProfile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
