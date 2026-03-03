import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Alleen afbeeldingen toegestaan" },
      { status: 400 }
    );
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Bestand is te groot (max 10MB)" },
      { status: 400 }
    );
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: upload to Vercel Blob
    const { put } = await import("@vercel/blob");
    const blob = await put(`images/${file.name}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local dev: convert to data URL for preview
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  return NextResponse.json({ url: dataUrl });
}
