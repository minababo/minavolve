import { Bell, LogOut, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

type AppTopbarProps = {
  userEmail: string;
  onLogout: () => Promise<void>;
};

export function AppTopbar({ userEmail, onLogout }: AppTopbarProps) {
  return (
    <header className="rounded-[2rem] border border-white/80 bg-white/86 p-4 shadow-[0_24px_80px_-58px_rgba(15,23,42,0.72)] backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            Authenticated workspace
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Delivery command center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Static dashboard shell for sprint planning, board visibility, risk
            review, analytics, and future AI assistance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Search className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">Search projects later</span>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <ShieldCheck className="size-4 shrink-0 text-emerald-700" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-emerald-800">
                Signed in
              </p>
              <p className="truncate text-sm font-semibold text-emerald-950">
                {userEmail}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="icon-lg"
            variant="outline"
            className="hidden rounded-2xl border-slate-200 bg-white text-slate-600 xl:inline-flex"
            aria-label="Notifications placeholder"
          >
            <Bell className="size-4" />
          </Button>

          <form action={onLogout}>
            <Button
              type="submit"
              size="lg"
              variant="outline"
              className="w-full rounded-2xl border-slate-300 bg-white px-4 text-slate-700 hover:text-slate-950 sm:w-auto"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
