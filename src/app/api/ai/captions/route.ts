import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServiceClient } from "@/lib/supabase/server";
import { withAuth, AuthenticatedHandler } from "@/lib/middleware/withAuth";
import { ApiError, ApiSuccess, AICaption } from "@/lib/supabase/types";

const createCaptionSchema = z.object({
  campaign_id: z.string().uuid("Invalid campaign ID format"),
  platform: z.enum(["telegram", "tiktok", "facebook"]),
  language: z.enum(["am", "or", "en"]),
  tone: z.enum(["formal", "emotional", "urgent"]),
});

interface CampaignWithChurch {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  current_amount: number;
  end_date: string | null;
  church: { name: string } | null;
}

const postHandler: AuthenticatedHandler = async (
  req,
  _authUser,
  userProfile,
) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured" } satisfies ApiError,
        { status: 500 },
      );
    }

    const body: unknown = await req.json();

    const result = createCaptionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() } as unknown as ApiError,
        { status: 400 },
      );
    }

    const { campaign_id, platform, language, tone } = result.data;

    const supabase = createServiceClient();

    // Fetch campaign with church name
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select(
        `
        id,
        title,
        description,
        goal_amount,
        current_amount,
        end_date,
        church:churches!church_id (
          name
        )
      `,
      )
      .eq("id", campaign_id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: "Campaign not found" } satisfies ApiError,
        { status: 404 },
      );
    }

    const typedCampaign = campaign as unknown as CampaignWithChurch;

    const languageLabel =
      language === "am"
        ? "Amharic"
        : language === "or"
          ? "Afan Oromo"
          : "English";

    const remaining =
      Number(typedCampaign.goal_amount) - Number(typedCampaign.current_amount);

    // Build combined prompt
    const prompt = `
You are a fundraising copywriter for Ethiopian Orthodox churches.
Write a ${platform} caption in ${languageLabel}.
Tone: ${tone}.
Be culturally respectful and faith-centered.
${platform === "telegram" ? "Include a clear call-to-action." : ""}
${platform === "tiktok" ? "Keep it under 150 characters with relevant hashtags." : ""}
${platform === "facebook" ? "Write 2-3 engaging paragraphs." : ""}

Campaign Details:
- Title: ${typedCampaign.title}
- Church: ${typedCampaign.church?.name ?? "N/A"}
- Description: ${typedCampaign.description ?? "No description provided"}
- Goal: ${typedCampaign.goal_amount} ETB
- Raised so far: ${typedCampaign.current_amount} ETB
- Remaining: ${remaining} ETB
- Deadline: ${typedCampaign.end_date ?? "No deadline set"}

Write only the caption text. No explanations or extra commentary.
`;

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const geminiResult = await model.generateContent(prompt);
    const generated_text = geminiResult.response.text();

    // Save to ai_captions table
    const { data: caption, error: insertError } = await supabase
      .from("ai_captions")
      .insert({
        campaign_id,
        language,
        platform,
        tone,
        generated_text,
        created_by: userProfile.id,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message } satisfies ApiError,
        { status: 500 },
      );
    }

    return NextResponse.json(
      { data: caption as AICaption } satisfies ApiSuccess<AICaption>,
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to generate caption. Please try again.",
      } satisfies ApiError,
      { status: 500 },
    );
  }
};

export const POST = withAuth(postHandler, ["admin", "treasurer"]);
