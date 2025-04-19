import "@/lib/cloudinary/server";
import { serverEnv } from "@/lib/env";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    serverEnv!.CLOUDINARY_API_SECRET
  );

  return Response.json({ signature });
}
