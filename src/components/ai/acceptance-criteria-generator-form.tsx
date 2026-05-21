"use client";

import { FormEvent, useState } from "react";
import { Loader2, ListChecks } from "lucide-react";

import { GeneratedCriteriaCard } from "@/components/ai/generated-criteria-card";
import { Button } from "@/components/ui/button";
import type { GeneratedCriteria } from "@/lib/ai/types";
import { aiCriteriaGeneratorSchema } from "@/lib/validators/ai-story";

type AcceptanceCriteriaGeneratorFormProps = {
  projectId: string;
};

type AiCriteriaApiResponse = {
  criteria?: GeneratedCriteria;
  error?: string;
};

export function AcceptanceCriteriaGeneratorForm({
  projectId,
}: AcceptanceCriteriaGeneratorFormProps) {
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContext, setStoryContext] = useState("");
  const [generatedCriteria, setGeneratedCriteria] =
    useState<GeneratedCriteria | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setGeneratedCriteria(null);

    const payload = { projectId, storyTitle, storyContext };
    const parsed = aiCriteriaGeneratorSchema.safeParse(payload);

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "Enter valid generator details.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/acceptance-criteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as AiCriteriaApiResponse;

      if (!response.ok || !data.criteria) {
        setError(data.error ?? "Unable to generate acceptance criteria right now.");
        return;
      }

      setGeneratedCriteria(data.criteria);
    } catch {
      setError("Network error while generating criteria. Try again.");
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
            User story title
            <input
              required
              minLength={10}
              maxLength={180}
              value={storyTitle}
              onChange={(event) => setStoryTitle(event.target.value)}
              placeholder="Example: Let project managers assign story points during sprint planning"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
            <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
              Required. Use 10 to 180 characters.
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Story description or context
            <textarea
              maxLength={800}
              rows={6}
              value={storyContext}
              onChange={(event) => setStoryContext(event.target.value)}
              placeholder="Example: The team needs to estimate effort before committing to a sprint. Story points use Fibonacci scale."
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
            <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
              Optional. Max 800 characters.
            </span>
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            Generated criteria are logged to Supabase for the current project.
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
              <ListChecks className="size-4" />
            )}
            {isLoading ? "Generating..." : "Generate criteria"}
          </Button>
        </div>
      </form>

      {generatedCriteria ? (
        <GeneratedCriteriaCard
          projectId={projectId}
          criteria={generatedCriteria}
        />
      ) : (
        <aside className="rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_25px_80px_-55px_rgba(15,23,42,0.9)]">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
            <ListChecks className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-2xl font-semibold">
            What Minavolve generates
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The assistant returns 3 to 8 testable acceptance criteria scoped to
            the story title. Each criterion is observable and verifiable by a
            tester.
          </p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-300">
            GROQ_API_KEY is read only from server environment variables. Client
            components call Minavolve&apos;s protected API route instead of the
            provider directly.
          </div>
        </aside>
      )}
    </div>
  );
}
