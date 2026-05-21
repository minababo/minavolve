alter table public.ai_generations
  drop constraint ai_generations_type_check;

alter table public.ai_generations
  add constraint ai_generations_type_check
    check (generation_type in (
      'standup_summary',
      'sprint_review',
      'risk_analysis',
      'story_breakdown',
      'general',
      'user_story',
      'acceptance_criteria'
    ));
