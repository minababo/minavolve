import { z } from "zod";

export const sprintStatuses = [
  "planned",
  "active",
  "completed",
  "cancelled",
] as const;

export type SprintStatus = (typeof sprintStatuses)[number];

const optionalDateSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.").nullable());

export const sprintFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Sprint name must be at least 3 characters.")
      .max(120, "Sprint name must be 120 characters or fewer."),
    goal: z
      .string()
      .trim()
      .max(2000, "Sprint goal must be 2000 characters or fewer.")
      .transform((value) => (value.length > 0 ? value : null)),
    start_date: optionalDateSchema,
    end_date: optionalDateSchema,
    status: z.enum(sprintStatuses),
  })
  .refine(
    (sprint) =>
      !sprint.start_date ||
      !sprint.end_date ||
      sprint.end_date >= sprint.start_date,
    {
      message: "End date cannot be earlier than start date.",
      path: ["end_date"],
    },
  );

export type SprintFormValues = z.infer<typeof sprintFormSchema>;
