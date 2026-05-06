import type { KanbanColumnModel } from "@/lib/kanban";

import { KanbanColumn } from "./kanban-column";

type KanbanBoardProps = {
  columns: KanbanColumnModel[];
};

export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1180px] grid-cols-5 gap-4">
        {columns.map((column) => (
          <KanbanColumn key={column.status} column={column} />
        ))}
      </div>
    </div>
  );
}
