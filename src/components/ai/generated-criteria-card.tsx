"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clipboard, ExternalLink, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GeneratedCriteria } from "@/lib/ai/types";

type GeneratedCriteriaCardProps = {
  projectId: string;
  criteria: GeneratedCriteria;
};

export function GeneratedCriteriaCard({
  projectId,
  criteria,
}: GeneratedCriteriaCardProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function copyAll() {
    const text = criteria.acceptance_criteria
      .map((item, i) => `${i + 1}. ${item}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    window.setTimeout(() => setCopiedAll(false), 1800);
  }

  async function copyItem(item: string, index: number) {
    await navigator.clipboard.writeText(item);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1800);
  }

  return (
    <article className="rounded-[2rem] border border-cyan-200/80 bg-cyan-50/80 p-5 shadow-[0_25px_80px_-55px_rgba(14,116,144,0.8)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">
          <ListChecks className="size-4" />
          Generated criteria
        </p>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-cyan-900">
          {criteria.acceptance_criteria.length} items
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {criteria.acceptance_criteria.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-white/80 px-4 py-3"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-cyan-700" />
            <span className="flex-1 text-sm leading-6 text-slate-700">
              {item}
            </span>
            <button
              type="button"
              onClick={() => copyItem(item, index)}
              aria-label="Copy this criterion"
              className="ml-2 shrink-0 text-slate-400 transition-colors hover:text-cyan-700"
            >
              {copiedIndex === index ? (
                <Check className="size-4 text-emerald-600" />
              ) : (
                <Clipboard className="size-4" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-cyan-900">
          Copy criteria into the manual story form.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={copyAll}
            className="h-11 rounded-2xl border-cyan-200 bg-white px-5 text-cyan-950 hover:bg-cyan-50"
          >
            {copiedAll ? (
              <Check className="size-4" />
            ) : (
              <Clipboard className="size-4" />
            )}
            {copiedAll ? "Copied" : "Copy all"}
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
