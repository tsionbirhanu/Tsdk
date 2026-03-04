// IMPORTANT: Before using this endpoint, create the storage
// bucket in Supabase dashboard:
// 1. Go to Supabase Dashboard → Storage
// 2. Click "New bucket"
// 3. Name it exactly: tsedk-media
// 4. Check "Public bucket" so files are publicly accessible
// 5. Click "Create bucket"

import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const handler: AuthenticatedHandler = async (request, user, _profile) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not supported" },
        { status: 400 },
      );
    }

    // Generate unique file path
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    const storagePath = `uploads/${fileName}`;

    // Determine file type
    let file_type: string;
    if (file.type.startsWith("image/")) {
      file_type = "image";
    } else if (file.type.startsWith("video/")) {
      file_type = "video";
    } else {
      file_type = "other";
    }

    const supabaseService = await createServiceClient();

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseService.storage
      .from("tsedk-media")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabaseService.storage
      .from("tsedk-media")
      .getPublicUrl(storagePath);

    const file_url = urlData.publicUrl;

    // Insert into media table
    const { data: media, error: insertError } = await supabaseService
      .from("media")
      .insert({
        file_url,
        file_type,
        storage_path: storagePath,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      // Clean up uploaded file if database insert fails
      await supabaseService.storage.from("tsedk-media").remove([storagePath]);

      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data: media }, { status: 201 });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
};

export const POST = withAuth(handler);
