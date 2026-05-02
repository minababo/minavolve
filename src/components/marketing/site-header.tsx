import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { marketingNav, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-slate-50 shadow-lg">
            <Sparkles className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-lg font-semibold text-slate-950">
              {siteConfig.name}
            </span>
            <span className="hidden text-sm text-slate-600 sm:block">
              {siteConfig.shortDescription}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="rounded-full text-slate-700 hover:text-slate-950"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="rounded-full px-5">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
