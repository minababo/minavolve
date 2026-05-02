import { kanbanColumns } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

export function KanbanPreview() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[980px] grid-cols-5 gap-4">
        {kanbanColumns.map((column) => (
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
