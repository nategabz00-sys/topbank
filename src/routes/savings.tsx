import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pause, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/savings")({
  head: () => ({
    meta: [
      { title: "Savings Challenges — Top Bank" },
      {
        name: "description",
        content: "Join savings challenges, track progress, and celebrate milestones with Top Bank.",
      },
      { property: "og:title", content: "Savings Challenges — Top Bank" },
      {
        property: "og:description",
        content: "Join savings challenges, track progress, and celebrate milestones with Top Bank.",
      },
    ],
  }),
  component: Savings,
});

const active = [
  {
    emoji: "☕",
    title: "No Coffee",
    saved: 3420,
    goal: 5700,
    pct: 60,
    eta: "Feb 14",
    tint: "emerald",
  },
  {
    emoji: "🍔",
    title: "No Fast Food",
    saved: 1250,
    goal: 4000,
    pct: 31,
    eta: "Mar 02",
    tint: "brand",
  },
  {
    emoji: "💰",
    title: "Round-Up Savings",
    saved: 892,
    goal: 2000,
    pct: 45,
    eta: "Jan 28",
    tint: "emerald",
  },
];

const catalog = [
  { emoji: "🎬", title: "Weekend Savings", desc: "Save a fixed amount every weekend" },
  { emoji: "📅", title: "52-Week Challenge", desc: "Weekly amount grows each week" },
  { emoji: "🎯", title: "Custom Goal", desc: "Set your own target and schedule" },
];

function Savings() {
  const [tab, setTab] = useState<"active" | "browse">("active");

  return (
    <MobileShell title="Savings">
      <div className="px-5 pt-3">
        {/* Hero — signature stat */}
        <div className="relative overflow-hidden rounded-3xl gradient-card p-5 text-white shadow-elevated">
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full gradient-emerald opacity-30 blur-2xl" />
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-emerald" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-white/60">
              Total Saved
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            ₱5,562<span className="text-lg text-white/60">.40</span>
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Stat label="Active" value="3" />
            <Stat label="Completed" value="7" />
            <Stat label="Streak" value="18d" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-full bg-muted p-1">
          {(["active", "browse"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-full py-2 text-xs font-semibold capitalize transition-all",
                tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {t === "active" ? "My Challenges" : "Browse"}
            </button>
          ))}
        </div>
      </div>

      {tab === "active" ? (
        <section className="px-5 mt-5 space-y-3">
          {active.map((c, i) => (
            <ChallengeCard key={i} {...c} />
          ))}
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground hover:border-emerald hover:text-emerald">
            <Plus className="h-4 w-4" /> Create custom challenge
          </button>
        </section>
      ) : (
        <section className="px-5 mt-5 space-y-3">
          {catalog.map((c, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-card hover:shadow-elevated transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-2xl">
                {c.emoji}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <span className="rounded-full gradient-emerald px-3 py-1 text-[11px] font-semibold text-emerald-foreground shadow-glow">
                Join
              </span>
            </button>
          ))}

          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-emerald">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-wider">Milestone reward</p>
            </div>
            <p className="mt-1 text-sm">
              Complete 3 challenges this quarter to unlock{" "}
              <span className="font-semibold">0.5% bonus interest</span> on your Time Deposit.
            </p>
          </div>
        </section>
      )}
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 py-2.5 backdrop-blur">
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/60">{label}</p>
    </div>
  );
}

function ChallengeCard({
  emoji,
  title,
  saved,
  goal,
  pct,
  eta,
}: {
  emoji: string;
  title: string;
  saved: number;
  goal: number;
  pct: number;
  eta: string;
  tint: string;
}) {
  const done = pct >= 100;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-2xl">
            {emoji}
          </span>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-[11px] text-muted-foreground">Est. complete · {eta}</p>
          </div>
        </div>
        <span className="text-lg font-bold tabular-nums text-emerald">{pct}%</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full gradient-emerald shimmer-line" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground tabular-nums">
          ₱{saved.toLocaleString()} <span className="opacity-60">/ ₱{goal.toLocaleString()}</span>
        </span>
        <div className="flex gap-1.5">
          <button
            aria-label="Pause"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent"
          >
            <Pause className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center gap-1 rounded-full gradient-emerald px-3 py-1.5 text-xs font-semibold text-emerald-foreground shadow-glow">
            {done ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Claim
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" strokeWidth={2.6} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
