import { cn } from "@/lib/utils";

type KanbanCard = {
  title: string;
  meta: string;
  tag: string;
};

type KanbanColumn = {
  title: string;
  count: string;
  accentClass: string;
  cards: KanbanCard[];
};

const columns: KanbanColumn[] = [
  {
    title: "Backlog",
    count: "8",
    accentClass: "bg-slate-200 text-slate-700",
    cards: [
      { title: "Define project empty state", meta: "UX copy - product", tag: "Ready" },
      { title: "Map profile defaults", meta: "Auth handoff - backend", tag: "Needs review" },
    ],
  },
  {
    title: "To Do",
    count: "5",
    accentClass: "bg-blue-100 text-blue-800",
    cards: [
      { title: "Create sprint planning route", meta: "App shell - frontend", tag: "Next" },
      { title: "Draft risk severity labels", meta: "Domain model - product", tag: "Queued" },
    ],
  },
  {
    title: "In Progress",
    count: "3",
    accentClass: "bg-cyan-100 text-cyan-900",
    cards: [
      { title: "Dashboard layout foundation", meta: "Issue #8 - frontend", tag: "Active" },
      { title: "Auth smoke test notes", meta: "Supabase - QA", tag: "Blocked" },
    ],
  },
  {
    title: "Review",
    count: "2",
    accentClass: "bg-amber-100 text-amber-900",
    cards: [
      { title: "README auth setup", meta: "Docs - reviewer", tag: "PR" },
      { title: "Dashboard copy pass", meta: "Design - product", tag: "QA" },
    ],
  },
  {
    title: "Done",
    count: "6",
    accentClass: "bg-emerald-100 text-emerald-900",
    cards: [
      { title: "Supabase SSR clients", meta: "Auth - platform", tag: "Shipped" },
      { title: "Protected dashboard route", meta: "Security - app", tag: "Shipped" },
    ],
  },
];

export function KanbanPreview() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[980px] grid-cols-5 gap-4">
        {columns.map((column) => (
          <section
            key={column.title}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-3"
          >
            <div className="flex items-center justify-between gap-3 px-1">
              <h3 className="font-heading text-lg font-semibold text-slate-950">
                {column.title}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  column.accentClass,
                )}
              >
                {column.count}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {column.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[1.25rem] border border-white bg-white p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.75)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium leading-6 text-slate-950">
                      {card.title}
                    </p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {card.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.meta}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
