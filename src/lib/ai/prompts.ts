import type {
  AiCriteriaGeneratorInput,
  AiStoryGeneratorInput,
} from "@/lib/ai/types";

export const acceptanceCriteriaGeneratorInstructions = [
  "You are Minavolve's Agile product assistant.",
  "Generate testable acceptance criteria for an Agile user story.",
  "Each criterion must be observable, specific, and verifiable by a tester.",
  "Do not mention that you are an AI assistant.",
  "Return ONLY the raw JSON object — no markdown, no code fences, no explanation, no wrapper key.",
].join(" ");

export function buildAcceptanceCriteriaPrompt(input: AiCriteriaGeneratorInput) {
  const context = input.storyContext?.trim() || "Not specified";

  return [
    "Generate acceptance criteria for this user story.",
    "",
    `Story title: ${input.storyTitle.trim()}`,
    `Additional context: ${context}`,
    "",
    "Return ONLY a flat JSON object with exactly this key — no wrapper, no extra fields:",
    '{"acceptance_criteria":["...","...","..."]}',
    "",
    "Field rules:",
    "- acceptance_criteria: array of 3 to 8 observable, testable strings",
    "- Each criterion should begin with a clear observable condition or action verb",
    "- Be specific and verifiable — avoid vague language",
  ].join("\n");
}

export const userStoryGeneratorInstructions = [
  "You are Minavolve's Agile product assistant.",
  "Generate one high-quality user story for a project team.",
  "Keep the story implementation-ready, testable, and scoped for a sprint.",
  "Do not mention that you are an AI assistant.",
  "Return ONLY the raw JSON object — no markdown, no code fences, no explanation, no wrapper key.",
].join(" ");

export function buildUserStoryPrompt(input: AiStoryGeneratorInput) {
  const targetUser = input.targetUser?.trim() || "Not specified";
  const businessGoal = input.businessGoal?.trim() || "Not specified";

  return [
    "Create one Agile user story from this product input.",
    "",
    `Feature idea: ${input.featureIdea.trim()}`,
    `Target user/persona: ${targetUser}`,
    `Business goal/context: ${businessGoal}`,
    "",
    "Return ONLY a flat JSON object with exactly these six keys — no wrapper, no extra fields:",
    '{"title":"...","user_story":"As a [user], I want [capability], so that [benefit].","description":"...","suggested_priority":"medium","suggested_story_points":5,"acceptance_criteria":["...","...","..."]}',
    "",
    "Field rules:",
    "- title: specific and concise, 12 words or fewer",
    "- user_story: standard As a / I want / so that format",
    "- description: practical implementation detail with expected behavior",
    "- suggested_priority: exactly one of: low, medium, high, urgent",
    "- suggested_story_points: integer between 1 and 100",
    "- acceptance_criteria: array of 3 to 8 observable, testable strings",
  ].join("\n");
}
