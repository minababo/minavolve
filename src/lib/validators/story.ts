import { z } from "zod";

export const storyPriorities = ["low", "medium", "high", "urgent"] as const;

export const storyStatuses = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
] as const;

export type StoryPriority = (typeof storyPriorities)[number];
export type StoryStatus = (typeof storyStatuses)[number];

function toOptionalUuid(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function parseAcceptanceCriteria(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export const storyFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Story title must be at least 3 characters.")
    .max(180, "Story title must be 180 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(4000, "Description must be 4000 characters or fewer.")
    .transform((value) => (value.length > 0 ? value : null)),
  acceptance_criteria: z
    .array(z.string().min(1))
    .max(25, "Use 25 acceptance criteria or fewer."),
  story_points: z.coerce
    .number({
      error: "Story points must be a number.",
    })
    .int("Story points must be a whole number.")
    .min(1, "Story points must be at least 1.")
    .max(100, "Story points must be 100 or fewer."),
  priority: z.enum(storyPriorities),
  status: z.enum(storyStatuses),
  sprint_id: z.preprocess(
    toOptionalUuid,
    z.uuid("Select a valid sprint.").nullable(),
  ),
});

export type StoryFormValues = z.infer<typeof storyFormSchema>;
