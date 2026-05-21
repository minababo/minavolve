import type { StoryPriority } from "@/lib/validators/story";

export type AiStoryGeneratorInput = {
  projectId: string;
  featureIdea: string;
  targetUser?: string | null;
  businessGoal?: string | null;
};

export type GeneratedUserStory = {
  title: string;
  user_story: string;
  description: string;
  suggested_priority: StoryPriority;
  suggested_story_points: number;
  acceptance_criteria: string[];
};

export type AiStoryGeneratorResponse = {
  story: GeneratedUserStory;
};

export const generatedUserStoryJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      description: "A concise user story title, 12 words or fewer.",
    },
    user_story: {
      type: "string",
      description:
        "A user story in the format: As a [user], I want [capability], so that [benefit].",
    },
    description: {
      type: "string",
      description:
        "A practical implementation description with product context and expected behavior.",
    },
    suggested_priority: {
      type: "string",
      enum: ["low", "medium", "high", "urgent"],
      description: "Suggested delivery priority.",
    },
    suggested_story_points: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      description: "Suggested story point estimate.",
    },
    acceptance_criteria: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      description: "Testable acceptance criteria.",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "title",
    "user_story",
    "description",
    "suggested_priority",
    "suggested_story_points",
    "acceptance_criteria",
  ],
} as const;
