// import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

// const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
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
