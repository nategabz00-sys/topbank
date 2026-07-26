import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Bell,
  ChevronRight,
  Coffee,
  CreditCard,
  Receipt,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  QrCode,
  Eye,
  EyeOff,
  Moon,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { transactions } from "@/lib/transactions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Top Bank — Smarter banking, smarter saving" },
      {
        name: "description",
        content:
          "Manage your money, track savings challenges, and pay anyone in seconds with Top Bank.",
      },
      { property: "og:title", content: "Top Bank — Smarter banking, smarter saving" },
      {
        property: "og:description",
        content:
          "Manage your money, track savings challenges, and pay anyone in seconds with Top Bank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { icon: CreditCard, label: "Loans", to: "/loans" as const },
  { icon: Receipt, label: "Bills Payment", to: "/transfer?flow=bills" as const },
  { icon: Banknote, label: "Time Deposit", to: "/time-deposit" as const },
  { icon: Star, label: "Favorites", to: "/transfer?view=favorites-all" as const },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      style={{ boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)" }}
    >
      {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  );
}

function Dashboard() {
  const [hidden, setHidden] = useState(false);

  return (
    <MobileShell>
      <div className="bg-[#FFF8F2] dark:bg-background min-h-full">
        {/* Custom non-sticky header */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between" style={{ height: 72 }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg,#FF9A2F,#FFC78A)" }}
                >
                  <span className="text-white font-semibold">SM</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald ring-2 ring-white" />
              </div>
              <div>
                <p className="text-sm" style={{ color: "#8A8A8A" }}>
                  Welcome back
                </p>
                <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                  John Paul
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Balance card */}
        <section className="px-5 mt-3">
          <div
            className="relative overflow-hidden p-5 text-white"
            style={{
              borderRadius: 32,
              background: "linear-gradient(135deg,#FFC78A 0%,#FF9A2F 60%,#F97316 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -48,
                top: -48,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "radial-gradient(closest-side, rgba(249,115,22,0.18), rgba(249,115,22,0) 60%)",
                filter: "blur(28px)",
              }}
            />

            <button
              aria-label="Favorite account"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white"
              style={{ boxShadow: "0 6px 18px rgba(249,115,22,0.18)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="#F97316"
                />
              </svg>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-widest text-white/90 uppercase">
                  TOPBANK
                </p>
                <p className="text-xs text-white/90">Payroll Ko Individual</p>
              </div>
              <div style={{ width: 36 }} />
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-white/90 uppercase tracking-wider">
                  CURRENT BALANCE
                </p>
                <button
                  onClick={() => setHidden((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                  aria-label={hidden ? "Show balance" : "Hide balance"}
                >
                  {hidden ? (
                    <EyeOff className="h-4 w-4 text-white" />
                  ) : (
                    <Eye className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight tabular-nums">
                  {hidden ? "••••" : "8,500"}
                </span>
                <span className="text-lg font-semibold text-white/90">{hidden ? "" : ".00"}</span>
                <span className="ml-2 text-sm font-medium">PHP</span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-white/80 uppercase tracking-wider">Card holder</p>
                  <p className="text-sm font-semibold mt-1">SHAIRE MAE</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  </div>
                  <p className="text-[13px] font-semibold tabular-nums">6038</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="px-5 mt-6">
          <div className="flex items-start justify-between gap-3 overflow-x-auto px-1 sm:px-0">
            {quickActions.map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="group inline-flex min-w-[92px] flex-1 flex-col items-center gap-3 text-center transition hover:-translate-y-0.5"
              >
                <span
                  className="flex h-18 w-18 items-center justify-center rounded-full bg-white shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition-colors duration-200 dark:bg-slate-800"
                  style={{ minWidth: 72, minHeight: 72 }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4E8DA] text-black shadow-sm dark:bg-slate-700 dark:text-black">
                    <Icon className="h-5.5 w-5.5" strokeWidth={2.2} />
                  </span>
                </span>
                <span className="text-sm font-semibold text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo carousel (unchanged) */}
        <section className="mt-6">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {[
              { title: "Earn 5% p.a.", desc: "Time Deposit promo", tone: "brand" },
              { title: "Zero fees", desc: "Send abroad free · 30d", tone: "emerald" },
              { title: "Cashback ×2", desc: "Weekend swipes", tone: "brand" },
            ].map((p, i) => (
              <div
                key={i}
                className={cn(
                  "snap-start shrink-0 w-[78%] rounded-2xl p-4 shadow-card",
                  p.tone === "brand"
                    ? "gradient-brand text-white"
                    : "gradient-emerald text-emerald-foreground",
                )}
              >
                <Sparkles className="h-4 w-4 opacity-80" />
                <p className="mt-2 text-lg font-bold tracking-tight">{p.title}</p>
                <p className="text-xs opacity-80">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Insights (unchanged) */}
        <section className="px-5 mt-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold">Spending this week</h3>
              </div>
              <span className="text-xs text-muted-foreground">Nov 4 – 10</span>
            </div>

            <div className="mt-4 flex h-24 items-end justify-between gap-1.5">
              {[40, 65, 30, 80, 55, 90, 45].map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-md bg-muted overflow-hidden flex items-end"
                    style={{ height: "100%" }}
                  >
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        i === 5 ? "gradient-emerald" : "bg-brand/70",
                      )}
                      style={{ height: `${v}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{"MTWTFSS"[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-muted-foreground">Weekly avg</span>
              <span className="font-semibold tabular-nums">₱1,284 / day</span>
            </div>
          </div>
        </section>

        {/* Recent transactions */}
        <section className="px-5 mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Recent activity</h3>
              <p className="text-xs text-muted-foreground">Latest transactions for quick review</p>
            </div>
            <Link
              to="/recent-activity"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand transition hover:text-brand/80"
            >
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            {transactions.slice(0, 4).map((tx) => (
              <li key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-3xl",
                    tx.in ? "bg-emerald/15 text-emerald" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {tx.in ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{tx.name}</p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {tx.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-right">
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
                  <p className="text-[11px] text-muted-foreground">{tx.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MobileShell>
  );
}

export default Dashboard;
