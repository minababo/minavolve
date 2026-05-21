export type VelocityDataPoint = {
  sprintName: string;
  completedPoints: number;
};

type SprintRow = {
  id: string;
  name: string;
};

type StoryRow = {
  sprint_id: string | null;
  story_points: number | null;
};

export function buildVelocityData(
  sprints: SprintRow[],
  stories: StoryRow[],
): VelocityDataPoint[] {
  return sprints.map((sprint) => ({
    sprintName: sprint.name,
    completedPoints: stories
      .filter((s) => s.sprint_id === sprint.id)
      .reduce((sum, s) => sum + (s.story_points ?? 0), 0),
  }));
}
