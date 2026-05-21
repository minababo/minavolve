"use client";

import { FormEvent, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { GeneratedStoryCard } from "@/components/ai/generated-story-card";
import { Button } from "@/components/ui/button";
import type { GeneratedUserStory } from "@/lib/ai/types";
import { aiStoryGeneratorSchema } from "@/lib/validators/ai-story";

type UserStoryGeneratorFormProps = {
  projectId: string;
};

type AiStoryApiResponse = {
  story?: GeneratedUserStory;
  error?: string;
};

export function UserStoryGeneratorForm({
  projectId,
}: UserStoryGeneratorFormProps) {
  const [featureIdea, setFeatureIdea] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [businessGoal, setBusinessGoal] = useState("");
  const [generatedStory, setGeneratedStory] =
    useState<GeneratedUserStory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setGeneratedStory(null);

    const payload = {
      projectId,
      featureIdea,
      targetUser,
      businessGoal,
    };
    const parsed = aiStoryGeneratorSchema.safeParse(payload);

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Enter valid generator details.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/user-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as AiStoryApiResponse;

      if (!response.ok || !data.story) {
        setError(data.error ?? "Unable to generate a user story right now.");
        return;
      }

      setGeneratedStory(data.story);
    } catch {
      setError("Network error while generating the story. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6"
      >
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5">
          <label className="block text-sm font-semibold text-slate-800">
            Feature idea
            <textarea
              required
              minLength={10}
              maxLength={800}
              rows={6}
              value={featureIdea}
              onChange={(event) => setFeatureIdea(event.target.value)}
              placeholder="Example: Let project owners invite teammates and assign roles from the workspace."
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
            <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
              Required. Use 10 to 800 characters.
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Target user/persona
            <input
              maxLength={200}
              value={targetUser}
              onChange={(event) => setTargetUser(event.target.value)}
              placeholder="Example: Scrum master, product owner, developer"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Business goal or context
            <textarea
              maxLength={800}
              rows={5}
              value={businessGoal}
              onChange={(event) => setBusinessGoal(event.target.value)}
              placeholder="Example: Reduce sprint planning admin time and make ownership clearer."
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            Generated drafts are logged to Supabase for the current project.
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isLoading ? "Generating..." : "Generate story"}
          </Button>
        </div>
      </form>

      {generatedStory ? (
        <GeneratedStoryCard projectId={projectId} story={generatedStory} />
      ) : (
        <aside className="rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_25px_80px_-55px_rgba(15,23,42,0.9)]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
            <Sparkles className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-2xl font-semibold">
            What Minavolve generates
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The assistant returns a structured story with title, user story,
            implementation description, priority, story points, and testable
            acceptance criteria.
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-300">
            The OpenAI API key is read only from server environment variables.
            Client components call Minavolve&apos;s protected API route instead
            of the provider directly.
          </div>
        </aside>
      )}
    </div>
  );
}
