import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/middleware/withAuth";
import { createServiceClient } from "@/lib/supabase/server";

const attachMediaSchema = z.object({
  media_id: z.string().uuid("Invalid media ID"),
  is_cover: z.boolean().default(false),
});

const removeMediaSchema = z.object({
  media_id: z.string().uuid("Invalid media ID"),
});

async function postHandler(
  request: NextRequest,
  { user, params }: { user: any; params: { id: string } },
) {
  try {
    const body = await request.json();

    const validatedData = attachMediaSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { media_id, is_cover } = validatedData.data;
    const campaign_id = params.id;
    const supabaseService = await createServiceClient();

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabaseService
      .from("campaigns")
      .select("id")
      .eq("id", campaign_id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    // Verify media exists
    const { data: media, error: mediaError } = await supabaseService
      .from("media")
      .select("id")
      .eq("id", media_id)
      .single();

    if (mediaError || !media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // If this should be the cover, remove existing cover first
    if (is_cover) {
      await supabaseService
        .from("campaign_media")
        .update({ is_cover: false })
        .eq("campaign_id", campaign_id)
        .eq("is_cover", true);
    }

    // Insert new campaign media record
    const { data: campaignMedia, error: insertError } = await supabaseService
      .from("campaign_media")
      .insert({
        campaign_id,
        media_id,
        is_cover,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data: campaignMedia }, { status: 201 });
  } catch (error) {
    console.error("Attach media error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

async function deleteHandler(
  request: NextRequest,
  { user, params }: { user: any; params: { id: string } },
) {
  try {
    const body = await request.json();

    const validatedData = removeMediaSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { media_id } = validatedData.data;
    const campaign_id = params.id;
    const supabaseService = await createServiceClient();

    // Delete from campaign_media
    const { error: deleteError } = await supabaseService
      .from("campaign_media")
      .delete()
      .eq("campaign_id", campaign_id)
      .eq("media_id", media_id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      data: { message: "Media removed from campaign" },
    });
  } catch (error) {
    console.error("Remove media error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export const POST = withAuth(postHandler, ["Admin", "Treasurer"]);
export const DELETE = withAuth(deleteHandler, ["Admin"]);
