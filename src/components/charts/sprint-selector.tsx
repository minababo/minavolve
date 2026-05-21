"use client";

import { useRouter } from "next/navigation";

type SprintOption = {
  id: string;
  name: string;
};

type SprintSelectorProps = {
  sprints: SprintOption[];
  selectedSprintId: string | null;
  projectId: string;
};

export function SprintSelector({
  sprints,
  selectedSprintId,
  projectId,
}: SprintSelectorProps) {
  const router = useRouter();

  if (sprints.length === 0) return null;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(
      `/projects/${projectId}/analytics/burndown?sprintId=${e.target.value}`,
    );
  }

  return (
    <select
      value={selectedSprintId ?? ""}
      onChange={handleChange}
      className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 focus:outline-none focus:ring-2 focus:ring-brand"
    >
      {sprints.map((sprint) => (
        <option key={sprint.id} value={sprint.id}>
          {sprint.name}
        </option>
      ))}
    </select>
  );
}
