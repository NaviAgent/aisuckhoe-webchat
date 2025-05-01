import { initCloudinary } from "@/lib/cloudinary/server";
import { getServerEnv } from "@/lib/env";

export async function POST(request: Request) {
  const serverEnv = getServerEnv();
  const body = await request.json();
  const { paramsToSign } = body;

  const cloudinary = await initCloudinary();
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    serverEnv!.CLOUDINARY_API_SECRET
  );

  return Response.json({ signature });
}
