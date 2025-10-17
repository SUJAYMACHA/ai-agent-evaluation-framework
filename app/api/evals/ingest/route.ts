import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const {
      interaction_id,
      prompt,
      response,
      score,
      latency_ms,
      flags = [],
      pii_tokens_redacted = 0,
    } = body;

    // Validate required fields
    if (!interaction_id || !prompt || !response || score === undefined || !latency_ms) {
      return NextResponse.json(
        { error: "Missing required fields: interaction_id, prompt, response, score, latency_ms" },
        { status: 400 }
      );
    }

    // Validate score range
    if (score < 0 || score > 1) {
      return NextResponse.json(
        { error: "Score must be between 0 and 1" },
        { status: 400 }
      );
    }

    // Insert the evaluation
    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        user_id: user.id,
        interaction_id,
        prompt,
        response,
        score,
        latency_ms,
        flags,
        pii_tokens_redacted,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting evaluation:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
