import {
  createStory,
  updateStory,
} from "@/app/(app)/projects/[projectId]/stories/actions";
import { Button } from "@/components/ui/button";
import { storyPriorities, storyStatuses } from "@/lib/validators/story";

export type StorySprintOption = {
  id: string;
  name: string;
  status: string;
};

type StoryDefaultValues = {
  title?: string;
  description?: string | null;
  acceptance_criteria?: string[] | null;
  story_points?: number;
  priority?: string;
  status?: string;
  sprint_id?: string | null;
};

const priorityLabels: Record<(typeof storyPriorities)[number], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusLabels: Record<(typeof storyStatuses)[number], string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

type StoryFormProps = {
  projectId: string;
  sprints: StorySprintOption[];
  error?: string;
  editMode?: boolean;
  storyId?: string;
  defaultValues?: StoryDefaultValues;
};

export function StoryForm({
  projectId,
  sprints,
  error,
  editMode = false,
  storyId,
  defaultValues,
}: StoryFormProps) {
  return (
    <form
      action={editMode ? updateStory : createStory}
      className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-[0_25px_80px_-55px_rgba(15,23,42,0.72)] backdrop-blur sm:p-6"
    >
      <input type="hidden" name="projectId" value={projectId} />
      {editMode && storyId && (
        <input type="hidden" name="storyId" value={storyId} />
      )}

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5">
        <label className="block text-sm font-semibold text-slate-800">
          Story title
          <input
            name="title"
            required
            minLength={3}
            maxLength={180}
            placeholder="As a team member, I can..."
            defaultValue={defaultValues?.title ?? ""}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-800">
          Description
          <textarea
            name="description"
            rows={5}
            maxLength={4000}
            placeholder="Describe the context, user need, and expected outcome."
            defaultValue={defaultValues?.description ?? ""}
            className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-800">
          Acceptance criteria
          <textarea
            name="acceptance_criteria"
            rows={6}
            placeholder={
              "Each non-empty line becomes one criterion.\nExample: User sees a success message after saving."
            }
            defaultValue={
              defaultValues?.acceptance_criteria?.join("\n") ?? ""
            }
            className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
          <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
            Blank lines are ignored.
          </span>
        </label>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-semibold text-slate-800">
            Story points
            <input
              name="story_points"
              required
              type="number"
              min={1}
              max={100}
              defaultValue={defaultValues?.story_points ?? 3}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Priority
            <select
              name="priority"
              defaultValue={defaultValues?.priority ?? "medium"}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {storyPriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Status
            <select
              name="status"
              defaultValue={defaultValues?.status ?? "backlog"}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              {storyStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-800">
            Sprint
            <select
              name="sprint_id"
              defaultValue={defaultValues?.sprint_id ?? ""}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            >
              <option value="">No sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name} ({sprint.status})
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
          {editMode ? "Save changes" : "Create story"}
        </Button>
      </div>
    </form>
  );
}
