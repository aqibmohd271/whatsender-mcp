import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  // Check if .env exists
  const envExists = fs.existsSync(path.join(process.cwd(), '.env'));

  return NextResponse.json({
    installed: envExists,
    nodeVersion: process.version,
    platform: process.platform,
    envExists
  });
}
