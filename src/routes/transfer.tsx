import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Zap,
  ShieldCheck,
  Wallet,
  X,
  Check,
  Copy,
  Share2,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/transfer")({
  head: () => ({
    meta: [
      { title: "Transfer — Top Bank" },
      { name: "description", content: "Send money in seconds to anyone, anywhere with Top Bank." },
      { property: "og:title", content: "Transfer — Top Bank" },
      {
        property: "og:description",
        content: "Send money in seconds to anyone, anywhere with Top Bank.",
      },
    ],
  }),
  component: Transfer,
});

const recents = [
  { name: "Mika", tag: "@mika_r", tint: "gradient-emerald" },
  { name: "Dad", tag: "•• 8821", tint: "gradient-brand" },
  { name: "Jio", tag: "@jio", tint: "bg-accent text-accent-foreground" },
  { name: "Nia", tag: "@nia_p", tint: "gradient-emerald" },
  { name: "Rey", tag: "•• 4410", tint: "gradient-brand" },
];

const accounts = [
  { id: "primary", label: "Primary · ••4271", balance: 184529.47 },
  { id: "savings", label: "Everyday · ••8802", balance: 42130.1 },
];

const methods = [
  { id: "insta", icon: "⚡", title: "InstaSend", desc: "Free · Arrives instantly" },
  { id: "bank", icon: "🏦", title: "Bank transfer", desc: "Any Philippine bank · Free" },
  { id: "intl", icon: "🌍", title: "International", desc: "120+ countries · Low fee" },
  { id: "wallet", icon: "📱", title: "Mobile wallet", desc: "GCash, Maya, PayPal" },
] as const;

interface TransferRecipient {
  name: string;
  tag: string;
  account?: string;
  bank?: string;
  ref?: string;
}

interface TransferReceipt {
  amount: number;
  recipient: TransferRecipient;
  reference: string;
  date: Date;
  method: string;
  account: string;
}

function Transfer() {
  const search = useRouterState({ select: (s) => s.location.search });
  const [amount, setAmount] = useState("2500");
  const [recipient, setRecipient] = useState<TransferRecipient>({
    name: recents[0].name,
    tag: recents[0].tag,
  });
  const [account, setAccount] = useState(accounts[0]);
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("insta");
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null);

  useEffect(() => {
    if (!search) return;
    const params = new URLSearchParams(search);
    const name = params.get("recipientName");
    const tag = params.get("recipientTag");
    const acc = params.get("account");
    const bank = params.get("bank");
    const ref = params.get("ref");
    const amountParam = params.get("amount");

    if (name && tag) {
      setRecipient({
        name,
        tag,
        account: acc ?? undefined,
        bank: bank ?? undefined,
        ref: ref ?? undefined,
      });
    }

    if (amountParam) {
      const parsed = Number(amountParam);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setAmount(parsed.toString());
      }
    }
  }, [search]);

  const amountNum = Number(amount || 0);
  const fee = method === "intl" ? Math.max(25, amountNum * 0.005) : 0;
  const total = amountNum + fee;
  const methodMeta = useMemo(() => methods.find((m) => m.id === method)!, [method]);

  const handleSend = () => {
    if (amountNum <= 0) {
      toast.error("Enter an amount to send");
      return;
    }
    if (amountNum > account.balance) {
      toast.error("Insufficient balance");
      return;
    }
    setSending(true);
    // Simulate network processing then present success receipt.
    setTimeout(() => {
      const ref =
        "TB" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10).toString();
      setReceipt({
        amount: amountNum,
        recipient,
        reference: ref,
        date: new Date(),
        method: methodMeta.title,
        account: account.label,
      });
      setSending(false);
    }, 700);
  };

  return (
    <MobileShell>
      {/* Hero amount card — primary focus */}
      <section className="px-5 pt-8">
        <div className="relative overflow-hidden rounded-[28px] gradient-card p-6 text-white shadow-elevated">
          <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full gradient-emerald opacity-25 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-widest text-white/60">
              You send
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur">
              <ShieldCheck className="h-3 w-3" /> Safe Send
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-white/70">₱</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal"
              aria-label="Amount"
              className="w-full min-w-0 bg-transparent text-6xl font-bold tabular-nums outline-none placeholder:text-white/30"
              placeholder="0"
            />
          </div>
          <p className="mt-1 text-xs text-white/60">
            Available {account.label} · ₱
            {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>

          <div className="mt-4 flex gap-2">
            {["500", "1000", "5000", "10000"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="flex-1 rounded-full bg-white/10 py-2 text-[11px] font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/15"
              >
                +₱{Number(v).toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* From account selector */}
      <section className="px-5 mt-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          From
        </p>
        <div className="grid grid-cols-2 gap-2">
          {accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccount(a)}
              className={cn(
                "rounded-2xl border p-3 text-left transition-all",
                account.id === a.id
                  ? "border-emerald bg-accent shadow-card"
                  : "border-border bg-card hover:bg-muted",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-background text-brand">
                  <Wallet className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-medium text-muted-foreground truncate">{a.label}</p>
              </div>
              <p className="mt-2 text-sm font-bold tabular-nums">
                ₱{a.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 mt-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Recipient
        </p>
        <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{recipient.name}</p>
              <p className="text-xs text-muted-foreground">{recipient.tag}</p>
            </div>
            <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-[#FF9A2F] bg-[#FF9A2F]/10">
              {recipient.account ? "QR" : "Recent"}
            </span>
          </div>
          {recipient.account && (
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Account</span>
                <span>{recipient.account}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bank</span>
                <span>{recipient.bank ?? "Top Bank"}</span>
              </div>
              {recipient.ref && (
                <div className="flex items-center justify-between">
                  <span>Reference</span>
                  <span>{recipient.ref}</span>
                </div>
              )}
            </div>
          )}
          {!recipient.account && (
            <p className="mt-4 text-sm text-muted-foreground">
              Choose a recent contact or scan a QR code to fill in recipient details.
            </p>
          )}
        </div>
      </section>

      {/* Recipient */}
      <section className="px-5 mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            To
          </p>
          <button className="text-xs font-medium text-emerald">Add new</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {recents.map((r) => {
            const selected = r.tag === recipient.tag;
            return (
              <button
                key={r.tag}
                onClick={() => setRecipient({ name: r.name, tag: r.tag })}
                className="flex shrink-0 flex-col items-center gap-1.5 w-16"
                aria-pressed={selected}
              >
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-card ring-offset-2 ring-offset-background transition-all",
                    r.tint,
                    selected && "ring-2 ring-emerald scale-105",
                  )}
                >
                  <span className="text-sm font-bold">{r.name.slice(0, 2).toUpperCase()}</span>
                </span>
                <span className={cn("text-[11px] font-medium", selected && "text-emerald")}>
                  {r.name}
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1">{r.tag}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Method */}
      <section className="mt-5 px-5">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Method
        </p>
        <div className="rounded-3xl border border-border bg-card p-1 shadow-card">
          {methods.map((m) => (
            <MethodRow
              key={m.id}
              icon={m.icon}
              title={m.title}
              desc={m.desc}
              active={method === m.id}
              onClick={() => setMethod(m.id)}
            />
          ))}
        </div>
      </section>

      {/* Summary + CTA */}
      <section className="mt-5 px-5">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <SummaryRow
            label="Amount"
            value={`₱${amountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          />
          <SummaryRow
            label="Fee"
            value={
              fee === 0 ? "Free" : `₱${fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            }
          />
          <div className="my-2 border-t border-border" />
          <SummaryRow
            label="Total"
            value={`₱${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            bold
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full gradient-emerald py-4 text-sm font-semibold text-emerald-foreground shadow-glow transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {sending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Processing…
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" strokeWidth={2.6} /> Send ₱{amountNum.toLocaleString()} now
            </>
          )}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Protected by TopBank Safe Send · Face ID required
        </p>
      </section>

      {receipt && <SuccessModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </MobileShell>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={cn("text-xs", bold ? "font-semibold text-foreground" : "text-muted-foreground")}
      >
        {label}
      </span>
      <span className={cn("tabular-nums", bold ? "text-base font-bold" : "text-sm font-medium")}>
        {value}
      </span>
    </div>
  );
}

function MethodRow({
  icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors",
        active ? "bg-accent" : "hover:bg-muted",
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background text-lg shadow-sm">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold flex items-center gap-2">
          {title}
          {active && (
            <span className="rounded-full bg-emerald/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald">
              Selected
            </span>
          )}
        </p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

/* ---------------- Success Modal + Flying Money animation ---------------- */

function SuccessModal({ receipt, onClose }: { receipt: TransferReceipt; onClose: () => void }) {
  const [showDetails, setShowDetails] = useState(false);

  // Deterministic per-render random trajectories.
  const bills = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 140 + Math.random() * 140;
        return {
          tx: Math.cos(angle) * dist,
          ty: -Math.abs(Math.sin(angle) * dist) - 60 - Math.random() * 120,
          r0: Math.random() * 40 - 20,
          r1: Math.random() * 720 - 360,
          delay: Math.random() * 0.35,
          scale: 0.7 + Math.random() * 0.6,
        };
      }),
    [],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 130;
        return {
          sx: Math.cos(angle) * dist,
          sy: Math.sin(angle) * dist - 30,
          delay: 0.2 + Math.random() * 0.9,
          size: 4 + Math.random() * 6,
        };
      }),
    [],
  );

  const copyRef = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(receipt.reference).then(
        () => toast.success("Reference copied"),
        () => toast.error("Couldn't copy"),
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Transfer successful"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-in"
      onClick={onClose}
    >
      {/* Flying money layer — sits above backdrop, below modal */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bills.map((b, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 money-fly"
            style={
              {
                animationDelay: `${b.delay}s`,
                "--tx": `${b.tx}px`,
                "--ty": `${b.ty}px`,
                "--r0": `${b.r0}deg`,
                "--r1": `${b.r1}deg`,
              } as React.CSSProperties
            }
          >
            <MoneyBill scale={b.scale} />
          </span>
        ))}
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full bg-white sparkle-float"
            style={
              {
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(255,215,120,0.9)",
                animationDelay: `${s.delay}s`,
                "--sx": `${s.sx}px`,
                "--sy": `${s.sy}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md rounded-t-[32px] bg-background p-6 pb-8 shadow-elevated sheet-in"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />

        {/* Animated check */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full success-glow" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full gradient-emerald text-white success-pop">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" className="check-draw" />
              </svg>
            </div>
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-tight">Transfer Successful</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your money is on its way to {receipt.recipient.name}
          </p>

          <p className="mt-5 text-4xl font-bold tabular-nums tracking-tight">
            ₱{receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-xs font-bold text-white">
              {receipt.recipient.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold leading-none">{receipt.recipient.name}</p>
              <p className="text-[11px] text-muted-foreground">{receipt.recipient.tag}</p>
              {receipt.recipient.account && (
                <p className="text-[11px] text-muted-foreground">
                  {receipt.recipient.account} · {receipt.recipient.bank ?? "Top Bank"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <ReceiptRow
            label="Date & Time"
            value={receipt.date.toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          />
          <ReceiptRow
            label="Reference"
            value={
              <button
                onClick={copyRef}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold hover:text-emerald"
              >
                {receipt.reference} <Copy className="h-3 w-3" />
              </button>
            }
          />
          {showDetails && (
            <>
              <ReceiptRow label="From" value={receipt.account} />
              {receipt.recipient.account && (
                <ReceiptRow
                  label="To"
                  value={`${receipt.recipient.account} · ${receipt.recipient.bank ?? "Top Bank"}`}
                />
              )}
              <ReceiptRow label="Method" value={receipt.method} />
              <ReceiptRow
                label="Status"
                value={<span className="text-emerald font-semibold">Completed</span>}
              />
            </>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-xs font-semibold hover:bg-muted"
          >
            <ReceiptIcon className="h-4 w-4" />
            {showDetails ? "Hide details" : "View details"}
          </button>
          <button
            onClick={() => toast.success("Receipt shared")}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-xs font-semibold hover:bg-muted"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full gradient-emerald py-4 text-sm font-semibold text-emerald-foreground shadow-glow"
        >
          <Check className="h-4 w-4" /> Done
        </button>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function MoneyBill({ scale = 1 }: { scale?: number }) {
  const w = 52 * scale;
  const h = 26 * scale;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 52 26"
      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))" }}
    >
      <defs>
        <linearGradient id="bill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="51"
        height="25"
        rx="3"
        fill="url(#bill)"
        stroke="#065f46"
        strokeWidth="0.6"
      />
      <circle cx="26" cy="13" r="6" fill="none" stroke="#ecfdf5" strokeWidth="0.8" />
      <text
        x="26"
        y="16.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#ecfdf5"
        fontFamily="ui-monospace, monospace"
      >
        ₱
      </text>
      <rect x="4" y="4" width="4" height="4" fill="#ecfdf5" opacity="0.7" />
      <rect x="44" y="18" width="4" height="4" fill="#ecfdf5" opacity="0.7" />
    </svg>
  );
}
