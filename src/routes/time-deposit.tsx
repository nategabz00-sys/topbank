import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Coins, Percent, ShieldCheck } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/time-deposit")({
  head: () => ({
    meta: [
      { title: "Time Deposit — Top Bank" },
      { name: "description", content: "Explore time deposit products from Top Bank." },
    ],
  }),
  component: TimeDeposit,
});

const depositProducts = [
  {
    term: "30 Days",
    rate: "4.2% p.a.",
    minimum: "₱5,000",
    earnings: "₱35",
    icon: CalendarDays,
  },
  {
    term: "90 Days",
    rate: "5.1% p.a.",
    minimum: "₱10,000",
    earnings: "₱128",
    icon: Percent,
  },
  {
    term: "180 Days",
    rate: "5.8% p.a.",
    minimum: "₱15,000",
    earnings: "₱285",
    icon: ShieldCheck,
  },
  {
    term: "1 Year",
    rate: "6.4% p.a.",
    minimum: "₱25,000",
    earnings: "₱820",
    icon: Coins,
  },
];

function TimeDeposit() {
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
              Time Deposit
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Time deposit options</h1>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">
            Choose a time deposit product that fits your savings goals and enjoy premium returns.
          </p>
        </div>

        <div className="space-y-3">
          {depositProducts.map((deposit) => {
            const Icon = deposit.icon;
            return (
              <div
                key={deposit.term}
                className="rounded-3xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FFF2E5] text-[#FF9A2F]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{deposit.term}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{deposit.rate}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Minimum deposit</p>
                    <p className="mt-1">{deposit.minimum}</p>
                  </div>
                  <div className="rounded-2xl bg-background p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Estimated earnings</p>
                    <p className="mt-1">{deposit.earnings}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">Preview only</span>
                  <span className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground">
                    Open Time Deposit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
