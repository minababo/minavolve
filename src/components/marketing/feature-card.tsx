import { CheckCircle2 } from "lucide-react";

import type { MarketingFeature } from "@/lib/site";

export function FeatureCard({ feature }: { feature: MarketingFeature }) {
  const { Icon, eyebrow, title, description, points } = feature;

  return (
    <article className="group rounded-[1.75rem] border border-slate-200/80 bg-slate-50/90 p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-slate-50">
          <Icon className="size-6" />
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </span>
      </div>

      <h3 className="mt-6 font-heading text-2xl font-semibold text-slate-950">
        {title}
      </h3>
      <p className="mt-3 text-base leading-7 text-slate-700">{description}</p>

      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-brand" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
