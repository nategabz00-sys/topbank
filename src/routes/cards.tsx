import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type MouseEvent } from "react";
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
    kind: "Everyday",
    type: "DEBIT",
    last: "6038",
    fullNumber: "4539 8821 4402 6038",
    expiry: "08/29",
    bgGradient: "from-[#FFB968] via-[#FF9A2F] to-[#F97316]",
    chipColor: "from-yellow-300 to-yellow-500",
    network: "VISA",
    cvv: "•••",
    cardHolder: "JOHN PAUL CRUZ",
  },
  {
    kind: "Platinum",
    type: "CREDIT",
    last: "2210",
    fullNumber: "5412 7788 3341 2210",
    expiry: "11/28",
    bgGradient: "from-[#4B5563] via-[#374151] to-[#1F2937]",
    chipColor: "from-yellow-300 to-yellow-500",
    network: "MASTERCARD",
    cvv: "•••",
    cardHolder: "JOHN PAUL CRUZ",
  },
  {
    kind: "Savings",
    type: "DEBIT",
    last: "8842",
    fullNumber: "4716 3390 5521 8842",
    expiry: "02/30",
    bgGradient: "from-[#10B981] to-[#059669]",
    chipColor: "from-yellow-300 to-yellow-500",
    network: "VISA",
    cvv: "•••",
    cardHolder: "JOHN PAUL CRUZ",
  },
];

function Cards() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [revealedNumbers, setRevealedNumbers] = useState<Record<number, boolean>>({});
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [transitionKey, setTransitionKey] = useState(0);
  const c = cards[idx];
  const isRevealed = !!revealedNumbers[idx];
  const displayNumber = isRevealed ? c.fullNumber : `•••• •••• •••• ${c.last}`;
  const shouldAnimate = transitionKey > 0;

  // Reset flip state when navigating to a different card
  useEffect(() => {
    setFlipped((current) => ({ ...current, [idx]: false }));
  }, [idx]);

  const getGradientStyle = (gradient: string) => {
    const gradientMap: Record<string, string> = {
      "from-[#FFB968] via-[#FF9A2F] to-[#F97316]":
        "linear-gradient(135deg, #FFB968 0%, #FF9A2F 50%, #F97316 100%)",
      "from-[#4B5563] via-[#374151] to-[#1F2937]":
        "linear-gradient(135deg, #4B5563 0%, #374151 50%, #1F2937 100%)",
      "from-[#10B981] to-[#059669]": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    };
    return gradientMap[gradient] || gradient;
  };

  const handleFlip = () => {
    setFlipped((current) => ({ ...current, [idx]: !current[idx] }));
  };

  const handleReveal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setRevealedNumbers((current) => ({ ...current, [idx]: !current[idx] }));
  };

  const goToCard = (nextIdx: number, direction: "next" | "prev" = "next") => {
    setSlideDirection(direction);
    setTransitionKey((current) => current + 1);
    setIdx((nextIdx + cards.length) % cards.length);
  };

  return (
    <MobileShell>
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
      <div className="px-5 pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mt-1">Your Wallet</h1>
        </div>

        <div className="relative mx-auto w-full max-w-sm" style={{ perspective: "1400px" }}>
          <div
            key={`${idx}-${transitionKey}`}
            className="relative mx-auto aspect-[1.6/1] w-full max-w-sm overflow-hidden rounded-3xl transition-all duration-300 ease-in-out"
            style={{
              animation: shouldAnimate
                ? slideDirection === "next"
                  ? "slideInFromRight 0.28s ease-in-out"
                  : "slideInFromLeft 0.28s ease-in-out"
                : "none",
              willChange: "transform, opacity",
            }}
          >
            <button
              type="button"
              onClick={handleFlip}
              aria-label={`Flip ${c.kind}`}
              className="relative block h-full w-full overflow-hidden rounded-3xl text-left shadow-elevated transition-all duration-300"
              style={{ transformStyle: "preserve-3d", perspective: "1400px" }}
            >
              <div
                className="relative h-full w-full transition-transform duration-500 ease-in-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: !!flipped[idx] ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-3xl p-6 text-white overflow-hidden flex flex-col"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    background: getGradientStyle(c.bgGradient),
                  }}
                >
                  {/* Diagonal stripe pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Top header with logo and badge */}
                  <div className="relative z-10 flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/90">
                        Top Bank
                      </p>
                      <p className="text-lg font-semibold text-white mt-0.5">{c.kind}</p>
                    </div>
                    <div className="rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-white/15 backdrop-blur-sm">
                      {c.type}
                    </div>
                  </div>

                  {/* Chip and contactless icon */}
                  <div className="relative z-10 flex items-center gap-3 mb-4">
                    <div
                      className="h-10 w-14 rounded-md shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)",
                      }}
                    />
                    <Wifi className="h-5 w-5 text-white/80 rotate-90" />
                  </div>

                  {/* Middle spacer */}
                  <div className="relative z-10 flex-1" />

                  {/* Card number - centered in middle */}
                  <div className="relative z-10 mb-6 flex items-center justify-start">
                    <p className="font-mono text-2xl font-semibold tracking-widest tabular-nums">
                      <span
                        className={cn(
                          "transition-opacity duration-300",
                          isRevealed ? "opacity-100" : "opacity-80",
                        )}
                      >
                        {displayNumber}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={handleReveal}
                      aria-label={isRevealed ? `Hide card number` : `Show card number`}
                      aria-pressed={isRevealed}
                      className="inline-flex h-7 w-7 items-center justify-center text-white/70 hover:text-white transition shrink-0 ml-2"
                    >
                      {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Bottom section: cardholder, expiry, network - anchored to bottom */}
                  <div className="relative z-10 flex items-end justify-between gap-1">
                    <div className="flex-1">
                      <p className="text-[8px] uppercase tracking-wider text-white/70 font-semibold leading-tight">
                        Card Holder
                      </p>
                      <p className="text-xs font-semibold text-white uppercase leading-tight mt-0.5">
                        {c.cardHolder}
                      </p>
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-[8px] uppercase tracking-wider text-white/70 font-semibold leading-tight">
                        Valid Thru
                      </p>
                      <p className="text-xs font-semibold text-white leading-tight mt-0.5">
                        {c.expiry}
                      </p>
                    </div>

                    <div className="flex-1 flex justify-end items-end">
                      {c.network === "MASTERCARD" ? (
                        <div className="flex gap-1">
                          <div className="h-5 w-5 rounded-full bg-red-500 shadow-lg" />
                          <div className="h-5 w-5 rounded-full bg-yellow-400 shadow-lg" />
                        </div>
                      ) : (
                        <p className="text-base font-bold text-white">{c.network}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden text-white"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: getGradientStyle(c.bgGradient),
                  }}
                >
                  <div className="absolute left-0 right-0 top-6 h-10 bg-black/80" />

                  <div className="absolute left-6 right-6 top-24 flex items-center gap-3">
                    <div className="relative h-9 flex-1 overflow-hidden rounded-md bg-white/95">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0 6px, rgba(0,0,0,0) 6px 12px)",
                        }}
                      />
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 font-[cursive] text-[13px] italic text-neutral-700">
                        {c.cardHolder}
                      </span>
                    </div>
                    <div className="flex h-9 w-16 flex-col items-center justify-center rounded-md bg-white text-neutral-900">
                      <span className="text-[8px] font-medium uppercase tracking-wider text-neutral-500">
                        CVV
                      </span>
                      <span className="font-mono text-xs font-semibold">{c.cvv}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/60">
                        Customer service
                      </p>
                      <p className="text-[10px] font-medium text-white/85">+63 2 8888 0000</p>
                    </div>
                    <span className="font-bold italic text-white">TB</span>
                  </div>

                  <p className="absolute left-6 right-6 top-[70%] text-[8px] leading-tight text-white/50">
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
            onClick={() => goToCard(idx - 1, "prev")}
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
            onClick={() => goToCard(idx + 1, "next")}
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
