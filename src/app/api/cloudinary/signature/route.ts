import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // not CLOUDINARY_API_KEY_SECRET
});

export async function POST(request: Request) {
  try {
    const { timestamp } = await request.json();

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "next_full_assest_manager",
      },
      process.env.CLOUDINARY_API_SECRET! // must match the key above
    );

    return NextResponse.json({
      signature,
      timestamp,
      apikey: process.env.CLOUDINARY_API_KEY, // key name must match what frontend expects
    });
  } catch (error) {
    console.error("Error while generating Cloudinary signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
