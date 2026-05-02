import type { MarketingStat } from "@/lib/site";

export function StatCard({ stat }: { stat: MarketingStat }) {
  return (
    <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_65px_-50px_rgba(15,23,42,0.7)] backdrop-blur">
      <p className="font-heading text-4xl font-semibold text-slate-950">
        {stat.value}
      </p>
      <h2 className="mt-2 text-base font-semibold text-slate-900">
        {stat.label}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{stat.detail}</p>
    </article>
  );
}
