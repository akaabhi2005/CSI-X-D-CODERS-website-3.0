import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Security Check: File Size Limit (Max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    // Security Check: Allowed MIME Types (Images & PDFs)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf"];
    if (file.type && !allowedMimeTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json({ success: false, error: "Invalid file type. Only images and PDFs are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique sanitized filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;
    
    const rawFolder = ((data.get("folder") as string) || (data.get("type") as string) || "gallery").toLowerCase();
    const allowedFolders = ["team", "events", "legacy", "news", "gallery"];
    const subDir = allowedFolders.includes(rawFolder) ? rawFolder : "gallery";
    const storagePath = `${subDir}/${filename}`;

    // STAGE 1: Primary Production Strategy - Supabase Storage Bucket ('media')
    try {
      const mimeType = file.type || "image/jpeg";
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);
        if (urlData?.publicUrl) {
          return NextResponse.json({ 
            success: true, 
            url: urlData.publicUrl,
            provider: "supabase-storage"
          });
        }
      } else if (uploadError) {
        console.warn("Notice: Supabase Storage upload check:", uploadError.message);
      }
    } catch (supabaseErr: any) {
      console.warn("Supabase Storage upload fallback notice:", supabaseErr?.message || supabaseErr);
    }

    // STAGE 2: Local Development Disk Write Fallback
    try {
      const dirPath = join(process.cwd(), "public", subDir);
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }
      const filepath = join(dirPath, filename);
      await writeFile(filepath, buffer);
      return NextResponse.json({ 
        success: true, 
        url: `/${subDir}/${filename}`,
        provider: "local-disk" 
      });
    } catch (diskErr) {
      console.warn("Disk write failed (Serverless/Vercel read-only filesystem). Falling back to Data URL:", diskErr);
      const mimeType = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ 
        success: true, 
        url: dataUrl,
        provider: "base64-data-url" 
      });
    }
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}

