import { NextResponse } from "next/server";

import {
  acceptanceCriteriaGeneratorInstructions,
  buildAcceptanceCriteriaPrompt,
} from "@/lib/ai/prompts";
import { type GeneratedCriteria } from "@/lib/ai/types";
import {
  aiCriteriaGeneratorSchema,
  generatedCriteriaSchema,
} from "@/lib/validators/ai-story";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

type GroqResponseBody = {
  error?: { message?: string } | null;
  model?: string;
  choices?: Array<{
    message?: { content?: string };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function getProviderErrorMessage(status: number, message?: string) {
  if (status === 401) {
    return "Groq rejected the API key. Check GROQ_API_KEY in the server environment.";
  }

  if (status === 429) {
    return "Groq rate limits were reached. Wait briefly and try again.";
  }

  if (message) {
    return `Groq could not generate criteria: ${message}`;
  }

  return "Groq could not generate criteria right now. Try again shortly.";
}

function getGenerationLogError(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("generation_type") ||
    normalized.includes("violates check constraint")
  ) {
    return "The ai_generations table does not currently allow generation_type = 'acceptance_criteria'. Apply migration 20260503000600 in the Supabase cloud SQL editor before retesting.";
  }

  if (normalized.includes("row-level security")) {
    return "Supabase blocked the generation log. Confirm you are still a project member and the AI generation RLS policies are applied.";
  }

  return "Criteria were generated, but Minavolve could not save the generation log.";
}

async function logGeneration({
  criteria,
  inputTokens,
  model,
  outputTokens,
  projectId,
  prompt,
  supabase,
  userId,
}: {
  criteria: GeneratedCriteria;
  inputTokens?: number;
  model: string;
  outputTokens?: number;
  projectId: string;
  prompt: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { error } = await supabase.from("ai_generations").insert({
    project_id: projectId,
    requested_by: userId,
    generation_type: "acceptance_criteria",
    prompt,
    response: JSON.stringify(criteria),
    provider: "groq",
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    status: "completed",
  });

  if (error) {
    throw new Error(getGenerationLogError(error.message));
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Sign in before generating acceptance criteria.", 401);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("Send valid JSON to generate acceptance criteria.");
  }

  const parsed = aiCriteriaGeneratorSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Enter valid generator details.",
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,name,project_key")
    .eq("id", parsed.data.projectId)
    .maybeSingle();

  if (projectError || !project) {
    return jsonError(
      "Project not found or you do not have access to generate criteria for it.",
      404,
    );
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return jsonError(
      "GROQ_API_KEY is missing. Add it to .env.local and restart the dev server.",
      503,
    );
  }

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const prompt = buildAcceptanceCriteriaPrompt(parsed.data);

  const providerResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: acceptanceCriteriaGeneratorInstructions },
          { role: "user", content: prompt },
        ],
      }),
    },
  );

  const providerJson = (await providerResponse
    .json()
    .catch(() => null)) as GroqResponseBody | null;

  if (!providerResponse.ok || !providerJson) {
    return jsonError(
      getProviderErrorMessage(
        providerResponse.status,
        providerJson?.error?.message,
      ),
      providerResponse.status || 502,
    );
  }

  const rawText = providerJson.choices?.[0]?.message?.content ?? "";

  if (!rawText) {
    return jsonError(
      "Groq returned an empty response. Try generating criteria again.",
      502,
    );
  }

  let rawCriteria: unknown;

  try {
    rawCriteria = JSON.parse(rawText);
  } catch {
    return jsonError(
      "Groq returned a response Minavolve could not parse as JSON.",
      502,
    );
  }

  const generated = generatedCriteriaSchema.safeParse(rawCriteria);

  if (!generated.success) {
    return jsonError(
      "Groq returned criteria that did not match the expected structure. Try again.",
      502,
    );
  }

  try {
    await logGeneration({
      criteria: generated.data,
      inputTokens: providerJson.usage?.prompt_tokens,
      model: providerJson.model ?? model,
      outputTokens: providerJson.usage?.completion_tokens,
      projectId: parsed.data.projectId,
      prompt,
      supabase,
      userId: user.id,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Criteria were generated, but Minavolve could not save the generation log.",
      500,
    );
  }

  return NextResponse.json({ criteria: generated.data });
}
