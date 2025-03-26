import { PrismaClient, Profile } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json();
  console.log(body);
  // const { userId } = await auth();

  // if (!userId) {
  //   throw new Error("You must be signed in to add an item to your cart");
  // }

  // try {
  //   const updatedProfile = await prisma.profile.update({
  //     where: { id },
  //     data: body,
  //   });
  //   return NextResponse.json(updatedProfile);
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json(
  //     { message: "Internal Server Error" },
  //     { status: 500 }
  //   );
  // }
}
