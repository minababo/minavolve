import { updateRiskStatus } from "@/app/(app)/projects/[projectId]/risks/actions";
import { cn } from "@/lib/utils";
import { riskScore } from "@/lib/validators/risk";

export type RiskCardRisk = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  likelihood: string;
  impact: string;
  status: string;
  created_at: string;
};

function getRiskSeverity(score: number) {
  if (score === 9)
    return { badge: "bg-rose-100 text-rose-800", label: "Critical" };
  if (score >= 6)
    return { badge: "bg-orange-100 text-orange-800", label: "High" };
  if (score >= 3)
    return { badge: "bg-amber-100 text-amber-800", label: "Medium" };
  return { badge: "bg-emerald-100 text-emerald-800", label: "Low" };
}

const statusClasses: Record<string, string> = {
  open: "bg-rose-100 text-rose-700",
  mitigating: "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800",
  accepted: "bg-slate-100 text-slate-700",
};

const ratingLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

type NextStatus = { label: string; value: string };

function getNextStatuses(currentStatus: string): NextStatus[] {
  if (currentStatus === "open") {
    return [{ label: "Mark as mitigating", value: "mitigating" }];
  }
  if (currentStatus === "mitigating") {
    return [
      { label: "Mark as resolved", value: "resolved" },
      { label: "Mark as accepted", value: "accepted" },
    ];
  }
  return [{ label: "Reopen", value: "open" }];
}

export function RiskCard({
  risk,
  projectId,
}: {
  risk: RiskCardRisk;
  projectId: string;
}) {
  const score = riskScore(risk.likelihood, risk.impact);
  const severity = getRiskSeverity(score);
  const nextStatuses = getNextStatuses(risk.status);

  return (
    <article className="rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_-55px_rgba(15,23,42,0.72)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
              statusClasses[risk.status] ?? "bg-slate-100 text-slate-700",
            )}
          >
            {risk.status}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              severity.badge,
            )}
          >
            {severity.label}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-heading text-2xl font-semibold text-slate-950">
            {score}
          </p>
          <p className="text-xs text-slate-400">/ 9</p>
        </div>
      </div>

      <h3 className="mt-4 line-clamp-2 font-heading text-xl font-semibold text-slate-950">
        {risk.title}
      </h3>

      {risk.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {risk.description}
        </p>
      )}

      <div className="mt-4 flex gap-6 text-xs">
        <div>
          <p className="text-slate-500">Likelihood</p>
          <p className="mt-0.5 font-semibold capitalize text-slate-800">
            {ratingLabels[risk.likelihood] ?? risk.likelihood}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Impact</p>
          <p className="mt-0.5 font-semibold capitalize text-slate-800">
            {ratingLabels[risk.impact] ?? risk.impact}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {nextStatuses.map((next) => (
          <form key={next.value} action={updateRiskStatus}>
            <input type="hidden" name="riskId" value={risk.id} />
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="newStatus" value={next.value} />
            <button
              type="submit"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
            >
              {next.label}
            </button>
          </form>
        ))}
      </div>
    </article>
  );
}
