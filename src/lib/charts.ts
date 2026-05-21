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

export type BurndownDataPoint = {
  date: string;
  ideal: number;
  actual: number | null;
};

type SprintForBurndown = {
  start_date: string | null;
  end_date: string | null;
};

type StoryForBurndown = {
  story_points: number | null;
  status: string;
};

export function buildBurndownData(
  sprint: SprintForBurndown,
  stories: StoryForBurndown[],
): BurndownDataPoint[] {
  if (!sprint.start_date || !sprint.end_date) return [];

  const totalPoints = stories.reduce(
    (sum, s) => sum + (s.story_points ?? 0),
    0,
  );
  const donePoints = stories
    .filter((s) => s.status === "done")
    .reduce((sum, s) => sum + (s.story_points ?? 0), 0);
  const remainingPoints = totalPoints - donePoints;

  const startDate = new Date(`${sprint.start_date}T00:00:00`);
  const endDate = new Date(`${sprint.end_date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (totalDays <= 0) return [];
  if (totalPoints === 0) return [];

  const effectiveToday = today > endDate ? endDate : today;
  const daysElapsed = Math.max(
    0,
    Math.round(
      (effectiveToday.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });

  return Array.from({ length: totalDays + 1 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const ideal = Math.round(totalPoints - (totalPoints * i) / totalDays);

    let actual: number | null = null;
    if (i <= daysElapsed) {
      actual =
        daysElapsed === 0
          ? totalPoints
          : Math.round(
              totalPoints -
                ((totalPoints - remainingPoints) * i) / daysElapsed,
            );
    }

    return { date: formatter.format(date), ideal, actual };
  });
}
