import { createFileRoute } from "@tanstack/react-router";
import { useState, type MouseEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Settings2,
  Snowflake,
  Wifi,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Cards — Top Bank" },
      {
        name: "description",
        content: "Manage physical and virtual cards, freeze, and control spending with Top Bank.",
      },
      { property: "og:title", content: "Cards — Top Bank" },
      {
        property: "og:description",
        content: "Manage physical and virtual cards, freeze, and control spending with Top Bank.",
      },
    ],
  }),
  component: Cards,
});

const cards = [
  {
    kind: "Platinum Debit",
    last: "4271",
    fullNumber: "1234 5678 9012 4271",
    grad: "gradient-card",
    cvv: "•••",
  },
  {
    kind: "Virtual Card",
    last: "8802",
    fullNumber: "2345 6789 0123 8802",
    grad: "gradient-emerald",
    cvv: "•••",
  },
  {
    kind: "Travel Card",
    last: "1194",
    fullNumber: "3456 7890 1234 1194",
    grad: "gradient-brand",
    cvv: "•••",
  },
];

function Cards() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [revealedNumbers, setRevealedNumbers] = useState<Record<number, boolean>>({});
  const c = cards[idx];
  const isRevealed = !!revealedNumbers[idx];
  const displayNumber = isRevealed ? c.fullNumber : `•••• •••• •••• ${c.last}`;

  const handleFlip = () => {
    setFlipped((current) => ({ ...current, [idx]: !current[idx] }));
  };

  const handleReveal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setRevealedNumbers((current) => ({ ...current, [idx]: !current[idx] }));
  };

  const goToCard = (nextIdx: number) => {
    setIdx((nextIdx + cards.length) % cards.length);
  };

  return (
    <MobileShell>
      <div className="px-5 pt-8">
        <div className="relative mx-auto w-full max-w-sm" style={{ perspective: "1400px" }}>
          <div className="relative mx-auto aspect-[1.6/1] w-full max-w-sm">
            <button
              type="button"
              onClick={handleFlip}
              aria-label={`Flip ${c.kind}`}
              className="relative block h-full w-full overflow-hidden rounded-3xl text-left shadow-elevated"
              style={{ transformStyle: "preserve-3d", perspective: "1400px" }}
            >
              <button
                type="button"
                onClick={handleReveal}
                aria-label={isRevealed ? `Hide ${c.kind} number` : `Show ${c.kind} number`}
                aria-pressed={isRevealed}
                className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20"
              >
                {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>

              <div
                className="relative h-full w-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: !!flipped[idx] ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className={cn("absolute inset-0 rounded-3xl p-5 text-white", c.grad)}
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-6 -left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] border border-white/10" />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/60">
                        Top Bank
                      </p>
                      <p className="mt-0.5 text-sm font-semibold">{c.kind}</p>
                    </div>
                    <Wifi className="h-5 w-5 rotate-90 text-white/80" />
                  </div>

                  <div className="absolute left-5 top-14 flex items-center gap-2">
                    <div className="h-8 w-11 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm" />
                    <div className="h-1.5 w-9 rounded-full bg-white/35" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-mono text-lg tracking-widest tabular-nums transition-all duration-300">
                      <span
                        className={cn(
                          "transition-opacity duration-300",
                          isRevealed ? "opacity-100" : "opacity-80",
                        )}
                      >
                        {displayNumber}
                      </span>
                    </p>
                    <div className="mt-2 flex items-end justify-between text-[11px] text-white/70">
                      <span>JOHN PAUL CRUZ</span>
                      <span className="font-bold italic text-white">TB</span>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div
                  className={cn("absolute inset-0 rounded-3xl overflow-hidden text-white", c.grad)}
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="absolute left-0 right-0 top-6 h-10 bg-black/80" />

                  <div className="absolute left-5 right-5 top-24 flex items-center gap-3">
                    <div className="relative h-9 flex-1 overflow-hidden rounded-md bg-white/95">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 6px, rgba(0,0,0,0) 6px 12px)",
                        }}
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 font-[cursive] text-[13px] italic text-neutral-700">
                        John Paul Cruz
                      </span>
                    </div>
                    <div className="flex h-9 w-16 flex-col items-center justify-center rounded-md bg-white text-neutral-900">
                      <span className="text-[8px] font-medium uppercase tracking-wider text-neutral-500">
                        CVV
                      </span>
                      <span className="font-mono text-xs font-semibold">{c.cvv}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/60">
                        Customer service
                      </p>
                      <p className="text-[10px] font-medium text-white/85">+63 2 8888 0000</p>
                    </div>
                    <span className="font-bold italic text-white">TB</span>
                  </div>

                  <p className="absolute left-5 right-5 top-[70%] text-[8px] leading-tight text-white/50">
                    This card is property of Top Bank. Unauthorized use is prohibited. If found,
                    please return to any Top Bank branch.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToCard(idx - 1)}
            aria-label="Previous card"
            disabled={idx === 0}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-card transition hover:scale-105 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show ${cards[i].kind}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-6 bg-brand" : "w-1.5 bg-muted-foreground/35",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToCard(idx + 1)}
            aria-label="Next card"
            disabled={idx === cards.length - 1}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-card transition hover:scale-105 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">Tap the card to flip</p>
      </div>

      {/* Card actions */}
      <section className="px-5 mt-6">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Snowflake, label: "Freeze" },
            { icon: Eye, label: "Details" },
            { icon: Settings2, label: "Limits" },
            { icon: Plus, label: "Add" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface-2 p-3 hover:bg-accent transition-colors"
            >
              <Icon className="h-5 w-5 text-brand" strokeWidth={2.2} />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Monthly spend · {c.kind}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                ₱24,829<span className="text-sm text-muted-foreground">.10</span>
              </p>
            </div>
            <span className="rounded-full bg-emerald/15 px-2 py-1 text-[11px] font-semibold text-emerald">
              -12% vs Oct
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Groceries", pct: 34, amount: 8420 },
              { name: "Dining", pct: 22, amount: 5460 },
              { name: "Transport", pct: 15, amount: 3720 },
              { name: "Shopping", pct: 12, amount: 2970 },
            ].map((row) => (
              <div key={row.name}>
                <div className="flex justify-between text-xs">
                  <span>{row.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    ₱{row.amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full gradient-emerald" style={{ width: `${row.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MobileShell>
  );
}
