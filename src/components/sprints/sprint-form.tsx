import { createSprint } from "@/app/(app)/projects/[projectId]/sprints/actions";
import { Button } from "@/components/ui/button";
import { sprintStatuses } from "@/lib/validators/sprint";

const statusLabels: Record<(typeof sprintStatuses)[number], string> = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

type SprintFormProps = {
  projectId: string;
  error?: string;
};

export function SprintForm({ projectId, error }: SprintFormProps) {
  return (
    <form
      action={createSprint}
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
          Sprint name
          <input
            name="name"
            required
            minLength={3}
            maxLength={120}
            placeholder="Sprint 1 - Launch readiness"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-800">
          Sprint goal
          <textarea
            name="goal"
            rows={5}
            maxLength={2000}
            placeholder="What outcome should this sprint create?"
            className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="block text-sm font-semibold text-slate-800">
            Start date
            <input
              name="start_date"
              type="date"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            End date
            <input
              name="end_date"
              type="date"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Status
            <select
              name="status"
              defaultValue="planned"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {sprintStatuses.map((status) => (
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
          Create sprint
        </Button>
      </div>
    </form>
  );
}
