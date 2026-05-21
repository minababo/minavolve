import { z } from "zod";

import { storyPriorities } from "@/lib/validators/story";

function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const aiStoryGeneratorSchema = z.object({
  projectId: z.uuid("Select a valid project."),
  featureIdea: z
    .string()
    .trim()
    .min(10, "Feature idea must be at least 10 characters.")
    .max(800, "Feature idea must be 800 characters or fewer."),
  targetUser: z.preprocess(
    normalizeOptionalText,
    z
      .string()
      .max(200, "Target user must be 200 characters or fewer.")
      .nullable(),
  ),
  businessGoal: z.preprocess(
    normalizeOptionalText,
    z
      .string()
      .max(800, "Business goal must be 800 characters or fewer.")
      .nullable(),
  ),
});

export const generatedUserStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Generated title is too short.")
    .max(180, "Generated title is too long."),
  user_story: z
    .string()
    .trim()
    .min(10, "Generated user story is too short.")
    .max(500, "Generated user story is too long."),
  description: z
    .string()
    .trim()
    .min(10, "Generated description is too short.")
    .max(2000, "Generated description is too long."),
  suggested_priority: z.enum(storyPriorities),
  suggested_story_points: z
    .number()
    .int("Generated story points must be a whole number.")
    .min(1, "Generated story points must be at least 1.")
    .max(100, "Generated story points must be 100 or fewer."),
  acceptance_criteria: z
    .array(z.string().trim().min(3).max(300))
    .min(1, "Generated story must include acceptance criteria.")
    .max(10, "Generated story has too many acceptance criteria."),
});

export type AiStoryGeneratorValues = z.infer<typeof aiStoryGeneratorSchema>;
