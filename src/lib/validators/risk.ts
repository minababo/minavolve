import { z } from "zod";

export const riskLikelihoods = ["low", "medium", "high"] as const;
export const riskImpacts = ["low", "medium", "high"] as const;
export const riskStatuses = ["open", "mitigating", "resolved", "accepted"] as const;

export type RiskLikelihood = (typeof riskLikelihoods)[number];
export type RiskImpact = (typeof riskImpacts)[number];
export type RiskStatus = (typeof riskStatuses)[number];

const ratingMap: Record<string, number> = { low: 1, medium: 2, high: 3 };

export function riskScore(likelihood: string, impact: string) {
  return (ratingMap[likelihood] ?? 1) * (ratingMap[impact] ?? 1);
}

function toOptionalText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const riskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Risk title must be at least 3 characters.")
    .max(180, "Risk title must be 180 characters or fewer."),
  description: z.preprocess(
    toOptionalText,
    z
      .string()
      .max(2000, "Description must be 2000 characters or fewer.")
      .nullable(),
  ),
  likelihood: z.enum(riskLikelihoods, {
    error: "Select a valid likelihood.",
  }),
  impact: z.enum(riskImpacts, {
    error: "Select a valid impact.",
  }),
  status: z.enum(riskStatuses, {
    error: "Select a valid status.",
  }),
});

export type RiskFormValues = z.infer<typeof riskFormSchema>;
