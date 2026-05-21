import { createRisk } from "@/app/(app)/projects/[projectId]/risks/actions";
import { Button } from "@/components/ui/button";
import { riskImpacts, riskLikelihoods, riskStatuses } from "@/lib/validators/risk";

const likelihoodLabels: Record<(typeof riskLikelihoods)[number], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const impactLabels: Record<(typeof riskImpacts)[number], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const statusLabels: Record<(typeof riskStatuses)[number], string> = {
  open: "Open",
  mitigating: "Mitigating",
  resolved: "Resolved",
  accepted: "Accepted",
};

type RiskFormProps = {
  projectId: string;
  error?: string;
};

export function RiskForm({ projectId, error }: RiskFormProps) {
  return (
    <form
      action={createRisk}
      className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6"
    >
      <input type="hidden" name="projectId" value={projectId} />

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5">
        <label className="block text-sm font-semibold text-slate-800">
          Risk title
          <input
            name="title"
            required
            minLength={3}
            maxLength={180}
            placeholder="Describe the risk concisely..."
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-800">
          Description
          <textarea
            name="description"
            rows={4}
            maxLength={2000}
            placeholder="Provide additional context about this risk."
            className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="block text-sm font-semibold text-slate-800">
            Likelihood
            <select
              name="likelihood"
              defaultValue="medium"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {riskLikelihoods.map((val) => (
                <option key={val} value={val}>
                  {likelihoodLabels[val]}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
              How likely is this to happen?
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Impact
            <select
              name="impact"
              defaultValue="medium"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {riskImpacts.map((val) => (
                <option key={val} value={val}>
                  {impactLabels[val]}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
              How severe if it occurs?
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Status
            <select
              name="status"
              defaultValue="open"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {riskStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
        >
          Add risk
        </Button>
      </div>
    </form>
  );
}
