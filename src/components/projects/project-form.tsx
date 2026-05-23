import { createProject } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { projectStatuses } from "@/lib/validators/project";

const statusLabels: Record<(typeof projectStatuses)[number], string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  archived: "Archived",
};

type ProjectDefaultValues = {
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  target_end_date: string | null;
};

type ProjectFormProps = {
  error?: string;
  editMode?: boolean;
  projectId?: string;
  defaultValues?: ProjectDefaultValues;
  action?: (formData: FormData) => void | Promise<void>;
};

export function ProjectForm({
  error,
  editMode = false,
  projectId,
  defaultValues,
  action = createProject,
}: ProjectFormProps) {
  return (
    <form
      action={action}
      className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6"
    >
      {editMode && projectId && (
        <input type="hidden" name="projectId" value={projectId} />
      )}

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5">
        <label className="block text-sm font-semibold text-slate-800">
          Project name
          <input
            name="name"
            required
            minLength={3}
            maxLength={120}
            placeholder="Minavolve launch"
            defaultValue={defaultValues?.name ?? ""}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          {!editMode && (
            <label className="block text-sm font-semibold text-slate-800">
              Project key
              <input
                name="project_key"
                required
                minLength={2}
                maxLength={10}
                pattern="[A-Za-z0-9]{2,10}"
                placeholder="MINA"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm uppercase tracking-[0.12em] text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
              />
              <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                2-10 letters or numbers. The server stores it uppercase.
              </span>
            </label>
          )}

          <label className="block text-sm font-semibold text-slate-800">
            Status
            <select
              name="status"
              defaultValue={defaultValues?.status ?? "active"}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-800">
          Description
          <textarea
            name="description"
            rows={5}
            maxLength={2000}
            placeholder="What is this project trying to deliver?"
            defaultValue={defaultValues?.description ?? ""}
            className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-800">
            Start date
            <input
              name="start_date"
              type="date"
              defaultValue={defaultValues?.start_date ?? ""}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Target end date
            <input
              name="target_end_date"
              type="date"
              defaultValue={defaultValues?.target_end_date ?? ""}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {editMode ? (
          <p className="text-sm leading-6 text-slate-500">
            Project key cannot be changed after creation.
          </p>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            Sprint, story, risk, and AI data will be connected in later issues.
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          className="h-11 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
        >
          {editMode ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
