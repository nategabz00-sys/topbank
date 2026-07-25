import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";
import { transactions } from "@/lib/transactions";

export const Route = createFileRoute("/recent-activity")({
  head: () => ({
    meta: [
      { title: "Recent Activity — Top Bank" },
      {
        name: "description",
        content: "View the complete transaction history for your Top Bank account.",
      },
      { property: "og:title", content: "Recent Activity — Top Bank" },
      {
        property: "og:description",
        content: "View the complete transaction history for your Top Bank account.",
      },
    ],
  }),
  component: RecentActivity,
});

function RecentActivity() {
  return (
    <MobileShell>
      <div className="px-5 pt-6 pb-24">
        <div className="mb-5 flex items-center gap-3">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Recent Activity
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Recent Activity</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3 rounded-3xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search transactions"
              aria-label="Search transactions"
              disabled
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-card"
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl",
                  tx.in ? "bg-emerald/15 text-emerald" : "bg-destructive/10 text-destructive",
                )}
              >
                {tx.in ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{tx.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{tx.description}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{tx.time}</p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    tx.in ? "text-emerald" : "text-destructive",
                  )}
                >
                  {tx.in ? "+" : "−"}₱
                  {Math.abs(tx.amount).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
