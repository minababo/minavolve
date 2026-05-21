"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clipboard, ExternalLink, ListChecks, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GeneratedUserStory } from "@/lib/ai/types";

type GeneratedStoryCardProps = {
  projectId: string;
  story: GeneratedUserStory;
};

function getCopyText(story: GeneratedUserStory) {
  return [
    `Title: ${story.title}`,
    "",
    story.user_story,
    "",
    `Description: ${story.description}`,
    "",
    `Priority: ${story.suggested_priority}`,
    `Story points: ${story.suggested_story_points}`,
    "",
    "Acceptance criteria:",
    ...story.acceptance_criteria.map((criterion) => `- ${criterion}`),
  ].join("\n");
}

export function GeneratedStoryCard({
  projectId,
  story,
}: GeneratedStoryCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyStory() {
    await navigator.clipboard.writeText(getCopyText(story));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <article className="rounded-[2rem] border border-cyan-200/80 bg-cyan-50/80 p-5 shadow-[0_25px_80px_-55px_rgba(14,116,144,0.8)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
            <Sparkles className="size-4" />
            Generated story
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-950">
            {story.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold capitalize text-cyan-900">
            {story.suggested_priority}
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-cyan-900">
            {story.suggested_story_points} pts
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <section className="rounded-[1.5rem] bg-white/82 p-4">
          <h3 className="text-sm font-semibold text-slate-800">User story</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {story.user_story}
          </p>
        </section>

        <section className="rounded-[1.5rem] bg-white/82 p-4">
          <h3 className="text-sm font-semibold text-slate-800">Description</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {story.description}
          </p>
        </section>

        <section className="rounded-[1.5rem] bg-white/82 p-4">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ListChecks className="size-4" />
            Acceptance criteria
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {story.acceptance_criteria.map((criterion) => (
              <li key={criterion} className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-cyan-700" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-cyan-900">
          Copy these fields into the manual story form. Direct story insertion
          remains out of scope for this issue.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={copyStory}
            className="h-11 rounded-2xl border-cyan-200 bg-white px-5 text-cyan-950 hover:bg-cyan-50"
          >
            {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
            {copied ? "Copied" : "Copy story"}
          </Button>
          <Button
            asChild
            size="lg"
            className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
          >
            <Link href={`/projects/${projectId}/stories/new`}>
              <ExternalLink className="size-4" />
              Open new story form
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
