import { z } from "zod";

export const projectStatuses = [
  "active",
  "paused",
  "completed",
  "archived",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

const optionalDateSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.").nullable());

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Project name must be at least 3 characters.")
      .max(120, "Project name must be 120 characters or fewer."),
    project_key: z
      .string()
      .trim()
      .transform((value) => value.toUpperCase())
      .refine(
        (value) => value.length >= 2 && value.length <= 10,
        "Project key must be 2 to 10 characters.",
      )
      .refine(
        (value) => /^[A-Z0-9]+$/.test(value),
        "Project key can only use uppercase letters and numbers.",
      ),
    description: z
      .string()
      .trim()
      .max(2000, "Description must be 2000 characters or fewer.")
      .transform((value) => (value.length > 0 ? value : null)),
    status: z.enum(projectStatuses),
    start_date: optionalDateSchema,
    target_end_date: optionalDateSchema,
  })
  .refine(
    (project) =>
      !project.start_date ||
      !project.target_end_date ||
      project.target_end_date >= project.start_date,
    {
      message: "Target end date cannot be earlier than start date.",
      path: ["target_end_date"],
    },
  );

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
