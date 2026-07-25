import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  FileText,
  Phone,
  Receipt as ReceiptIcon,
  Share2,
  ShieldCheck,
  Star,
  Wallet,
  X,
  Zap,
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

type View = "menu" | "reminder" | "form" | "review" | "success" | "recent-all" | "favorites-all";
type TransferFlow = "top-mobile" | "top-account" | "instapay" | "pesonet" | "bills";

interface TransferRecipient {
  id: string;
  name: string;
  tag: string;
  detail: string;
  account?: string;
  bank?: string;
  ref?: string;
  type: string;
  flow: TransferFlow;
  lastUsed: string;
  logo: string;
}

interface TransferReceipt {
  amount: number;
  recipient: TransferRecipient;
  reference: string;
  date: Date;
  method: string;
  account: string;
}

interface FormState {
  recipientName: string;
  recipientAccount: string;
  recipientBank: string;
  recipientMobile: string;
  note: string;
  amount: string;
  biller: string;
  reference: string;
}

interface AccountOption {
  id: string;
  label: string;
  balance: number;
}

const accounts: AccountOption[] = [
  { id: "primary", label: "Primary · ••4271", balance: 184529.47 },
  { id: "savings", label: "Everyday · ••8802", balance: 42130.1 },
];

const initialRecentRecipients: TransferRecipient[] = [
  {
    id: "mika",
    name: "Mika",
    tag: "@mika_r",
    detail: "0917 232 1123",
    flow: "top-mobile",
    type: "Top Bank transfer",
    lastUsed: "Today • 2:40 PM",
    logo: "MK",
    bank: "Top Bank",
  },
  {
    id: "dad",
    name: "Dad",
    tag: "Dad",
    detail: "•• 8821",
    flow: "top-account",
    type: "Account transfer",
    lastUsed: "Yesterday",
    logo: "DA",
    bank: "Top Bank",
  },
  {
    id: "insta-sample",
    name: "Lara",
    tag: "Lara",
    detail: "•• 4410",
    flow: "instapay",
    type: "InstaPay",
    lastUsed: "Mon",
    logo: "LP",
    bank: "BDO",
  },
  {
    id: "bills-sample",
    name: "Meralco",
    tag: "Bills",
    detail: "•• 1002",
    flow: "bills",
    type: "Bills payment",
    lastUsed: "Sun",
    logo: "ME",
    bank: "Meralco",
  },
];

const initialFavorites = ["mika", "insta-sample"];

function createDefaultFormState(previous?: FormState): FormState {
  return {
    recipientName: "",
    recipientAccount: "",
    recipientBank: "Top Bank",
    recipientMobile: "",
    note: "",
    amount: previous?.amount ?? "",
    biller: "",
    reference: "",
  };
}

function formatCurrency(value: string | number) {
  const numeric = typeof value === "number" ? value : Number(value || 0);
  if (!Number.isFinite(numeric)) return "0.00";
  return numeric.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatAmountDisplay(value: string) {
  if (!value) return "";
  const numeric = Number(value.toString().replace(/,/g, ""));
  if (!Number.isFinite(numeric)) return "";
  return formatCurrency(numeric);
}

function maskValue(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "—";
  if (digits.length <= 4) return `•• ${digits.slice(-2)}`;
  return `${digits.slice(0, 2)}••••${digits.slice(-4)}`;
}

function Transfer() {
  const search = useRouterState({ select: (s) => s.location.search });
  const [view, setView] = useState<View>("menu");
  const [flow, setFlow] = useState<TransferFlow | null>(null);
  const [formData, setFormData] = useState<FormState>(() => createDefaultFormState());
  const [account] = useState<AccountOption>(accounts[0]);
  const [activeRecipient, setActiveRecipient] = useState<TransferRecipient | null>(null);
  const [recentRecipients, setRecentRecipients] = useState(initialRecentRecipients);
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [recentSearch, setRecentSearch] = useState("");
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null);

  useEffect(() => {
    if (!search) return;
    const params = new URLSearchParams(search);
    const name = params.get("recipientName");
    const acc = params.get("account");
    const bank = params.get("bank");
    const ref = params.get("ref");
    const amountParam = params.get("amount");
    const flowParam = params.get("flow") as TransferFlow | null;
    const viewParam = params.get("view") as View | null;

    setFormData((prev) => ({
      ...prev,
      recipientName: name ?? prev.recipientName,
      recipientAccount: acc ?? prev.recipientAccount,
      recipientBank: bank ?? prev.recipientBank,
      reference: ref ?? prev.reference,
      amount: amountParam ?? prev.amount,
    }));

    if (
      flowParam &&
      ["top-mobile", "top-account", "instapay", "pesonet", "bills"].includes(flowParam)
    ) {
      setFlow(flowParam);
      setView(flowParam === "instapay" || flowParam === "pesonet" ? "reminder" : "form");
      setActiveRecipient(null);
      setErrors({});
      return;
    }

    if (viewParam === "recent-all" || viewParam === "favorites-all") {
      setFlow(null);
      setActiveRecipient(null);
      setView(viewParam);
      setErrors({});
    }
  }, [search]);

  const amountNum = Number(formData.amount || 0);
  const total = amountNum;

  const recentFiltered = useMemo(
    () =>
      recentRecipients.filter((recipient) => {
        const search = recentSearch.toLowerCase();
        return (
          recipient.name.toLowerCase().includes(search) ||
          recipient.detail.toLowerCase().includes(search) ||
          recipient.bank?.toLowerCase().includes(search) ||
          recipient.type.toLowerCase().includes(search)
        );
      }),
    [recentRecipients, recentSearch],
  );

  const favoriteFiltered = useMemo(
    () =>
      recentRecipients
        .filter((recipient) => favorites.includes(recipient.id))
        .filter((recipient) => {
          const search = favoriteSearch.toLowerCase();
          return (
            recipient.name.toLowerCase().includes(search) ||
            recipient.detail.toLowerCase().includes(search) ||
            recipient.bank?.toLowerCase().includes(search) ||
            recipient.type.toLowerCase().includes(search)
          );
        }),
    [favoriteSearch, favorites, recentRecipients],
  );

  const openFlow = (nextFlow: TransferFlow, recipient?: TransferRecipient | null) => {
    setFlow(nextFlow);
    setErrors({});
    setActiveRecipient(recipient ?? null);

    if (recipient) {
      setFormData((prev) => ({
        ...prev,
        recipientName: recipient.name,
        recipientAccount: recipient.account ?? "",
        recipientBank: recipient.bank ?? "Top Bank",
        recipientMobile: recipient.flow === "top-mobile" ? recipient.detail : prev.recipientMobile,
        note: recipient.ref ?? "",
        biller: recipient.flow === "bills" ? recipient.name : prev.biller,
        reference: recipient.flow === "bills" ? recipient.detail : prev.reference,
        amount: "",
      }));
    } else {
      setFormData((prev) => ({ ...createDefaultFormState(prev), amount: prev.amount }));
    }

    if (nextFlow === "instapay" || nextFlow === "pesonet") {
      setView("reminder");
    } else {
      setView("form");
    }
  };

  const handleBack = () => {
    setErrors({});
    if (view === "review") {
      setView("form");
      return;
    }
    if (
      view === "form" ||
      view === "reminder" ||
      view === "recent-all" ||
      view === "favorites-all"
    ) {
      setFlow(null);
      setActiveRecipient(null);
      setView("menu");
      return;
    }
    if (view === "success") {
      setReceipt(null);
      setFlow(null);
      setActiveRecipient(null);
      setView("menu");
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    const amountValue = Number(formData.amount || 0);

    if (amountValue <= 0) {
      nextErrors.amount = "Enter an amount to continue";
    } else if (amountValue > account.balance) {
      nextErrors.amount = "Insufficient balance";
    }

    if (!flow) return nextErrors;

    switch (flow) {
      case "top-mobile":
        if (!formData.recipientName.trim()) nextErrors.recipientName = "Enter recipient name";
        if (!/^\+?[0-9\s-]{7,15}$/.test(formData.recipientMobile.replace(/\s+/g, ""))) {
          nextErrors.recipientMobile = "Enter a valid mobile number";
        }
        break;
      case "top-account":
      case "instapay":
      case "pesonet":
        if (!formData.recipientName.trim()) nextErrors.recipientName = "Enter account name";
        if (!/^[0-9]{6,20}$/.test(formData.recipientAccount)) {
          nextErrors.recipientAccount = "Enter a valid account number";
        }
        if (!formData.recipientBank.trim()) nextErrors.recipientBank = "Select a bank";
        break;
      case "bills":
        if (!formData.biller.trim()) nextErrors.biller = "Choose a biller";
        if (!formData.reference.trim()) nextErrors.reference = "Add an account or reference number";
        break;
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleContinue = () => {
    if (Object.keys(validateForm()).length > 0) return;
    setView("review");
  };

  const handleSend = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      const ref =
        "TB" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10).toString();
      const recipientLabel =
        flow === "bills"
          ? formData.biller
          : formData.recipientName || activeRecipient?.name || "Recipient";
      const detail =
        flow === "top-mobile"
          ? formData.recipientMobile
          : flow === "bills"
            ? formData.reference
            : formData.recipientAccount;
      const nextRecipient: TransferRecipient = {
        id: `${flow ?? "transfer"}-${Date.now()}`,
        name: recipientLabel,
        tag: recipientLabel,
        detail,
        account: formData.recipientAccount || activeRecipient?.account,
        bank: formData.recipientBank || activeRecipient?.bank,
        ref: formData.note || formData.reference || activeRecipient?.ref,
        type:
          flow === "instapay"
            ? "InstaPay"
            : flow === "pesonet"
              ? "PESONet"
              : flow === "bills"
                ? "Bills payment"
                : "Transfer",
        flow: flow ?? "top-mobile",
        lastUsed: "Just now",
        logo:
          flow === "instapay" ? "IP" : flow === "pesonet" ? "PN" : flow === "bills" ? "BL" : "TR",
      };

      setRecentRecipients((prev) =>
        [nextRecipient, ...prev.filter((item) => item.id !== nextRecipient.id)].slice(0, 5),
      );
      setReceipt({
        amount: amountNum,
        recipient: nextRecipient,
        reference: ref,
        date: new Date(),
        method:
          flow === "instapay"
            ? "InstaPay"
            : flow === "pesonet"
              ? "PESONet"
              : flow === "bills"
                ? "Bills Payment"
                : "Top Bank Transfer",
        account: account.label,
      });
      setSending(false);
      setView("success");
    }, 700);
  };

  const headerTitle =
    view === "recent-all"
      ? "Recent Transfers"
      : view === "favorites-all"
        ? "Favorite Recipients"
        : flow === "instapay"
          ? "InstaPay"
          : flow === "pesonet"
            ? "PESONet"
            : flow === "bills"
              ? "Bills Payment"
              : flow === "top-mobile"
                ? "Transfer with Mobile Number"
                : flow === "top-account"
                  ? "Transfer with Account Number"
                  : "Transfer";

  return (
    <MobileShell>
      <div className="min-h-full bg-[#FFF8F2] px-5 pb-24 pt-5 dark:bg-background">
        {view !== "menu" && (
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {flow === "instapay" || flow === "pesonet" ? "Reminder" : "Transfer"}
              </p>
              <h2 className="text-lg font-semibold text-foreground">{headerTitle}</h2>
            </div>
          </div>
        )}

        {view === "menu" ? (
          <>
            <section className="rounded-[28px] border border-border/60 bg-card p-5 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.24)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Transfer
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold text-foreground">
                    Move money with ease
                  </h1>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF9A2F]/12 text-[#FF9A2F]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 rounded-[24px] bg-gradient-to-br from-[#FFB968] via-[#FF9A2F] to-[#F97316] p-4 text-white shadow-[0_16px_40px_-18px_rgba(249,115,22,0.65)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                      Quick send
                    </p>
                    <p className="mt-1 text-xl font-semibold">₱{formatCurrency(total)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/15 px-3 py-2 text-[11px] font-semibold backdrop-blur">
                    Safe transfer
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {[500, 1000, 5000, 10000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFormData((prev) => ({ ...prev, amount: String(v) }))}
                      className="flex-1 rounded-full bg-white/15 px-2 py-2 text-[11px] font-semibold text-white/90"
                    >
                      +₱{v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  To Top Bank Accounts
                </h3>
              </div>
              <div className="grid gap-3">
                <TransferOptionCard
                  title="Transfer with Mobile Number"
                  subtitle="Send to a saved Top Bank contact quickly"
                  icon={<Phone className="h-5 w-5" />}
                  onClick={() => openFlow("top-mobile")}
                />
                <TransferOptionCard
                  title="Transfer with Account Number"
                  subtitle="Send to any Top Bank account"
                  icon={<Building2 className="h-5 w-5" />}
                  onClick={() => openFlow("top-account")}
                />
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  To Other Banks
                </h3>
              </div>
              <div className="grid gap-3">
                <TransferOptionCard
                  title="InstaPay"
                  subtitle="Real-time transfer to other banks."
                  icon={
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F172A] text-[11px] font-semibold text-white">
                      IP
                    </div>
                  }
                  onClick={() => openFlow("instapay")}
                />
                <TransferOptionCard
                  title="PESONet"
                  subtitle="Scheduled transfer to other banks."
                  icon={
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F766E] text-[11px] font-semibold text-white">
                      PN
                    </div>
                  }
                  onClick={() => openFlow("pesonet")}
                />
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Bills Payment
                </h3>
              </div>
              <TransferOptionCard
                title="Pay Bills"
                subtitle="Settle electricity, water, and other bills"
                icon={<Banknote className="h-5 w-5" />}
                onClick={() => openFlow("bills")}
              />
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Recent
                </h3>
                <button
                  type="button"
                  onClick={() => setView("recent-all")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF9A2F] hover:text-[#ff7a16]"
                >
                  See All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {recentRecipients.map((recipient) => {
                  const isFavorite = favorites.includes(recipient.id);
                  return (
                    <div
                      key={recipient.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openFlow(recipient.flow, recipient)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openFlow(recipient.flow, recipient);
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-[22px] border border-border bg-card p-3 text-left shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2E5] text-sm font-semibold text-[#FF9A2F] dark:bg-[#1f2937]">
                          {recipient.logo}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{recipient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {maskValue(recipient.detail)} · {recipient.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">{recipient.lastUsed}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(recipient.id);
                          }}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors",
                            isFavorite && "bg-[#FF9A2F]/10 text-[#FF9A2F]",
                          )}
                        >
                          <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Favorites
                </h3>
                <button
                  type="button"
                  onClick={() => setView("favorites-all")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF9A2F] hover:text-[#ff7a16]"
                >
                  See All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {recentRecipients
                  .filter((recipient) => favorites.includes(recipient.id))
                  .map((recipient) => (
                    <div
                      key={recipient.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openFlow(recipient.flow, recipient)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openFlow(recipient.flow, recipient);
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-[22px] border border-border bg-card p-3 text-left shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2E5] text-sm font-semibold text-[#FF9A2F] dark:bg-[#1f2937]">
                          {recipient.logo}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{recipient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {maskValue(recipient.detail)} · {recipient.type}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
              </div>
            </section>
          </>
        ) : view === "reminder" ? (
          <section className="rounded-[28px] border border-border bg-card p-5 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.24)]">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#FFF2E5] text-lg font-semibold text-[#FF9A2F] dark:bg-[#1f2937]">
                {flow === "instapay" ? "IP" : "PN"}
              </div>
            </div>
            <h3 className="mt-4 text-center text-xl font-semibold text-foreground">
              {flow === "instapay" ? "InstaPay reminder" : "PESONet reminder"}
            </h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {flow === "instapay"
                ? "Please review the reminder details before proceeding to the transfer form."
                : "Please review the schedule and cut-off reminders before continuing."}
            </p>
            <div className="mt-5 rounded-[24px] bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-[#FF9A2F]/10 p-2 text-[#FF9A2F]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {flow === "instapay" ? "Fast and secure transfer" : "Scheduled transfer window"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {flow === "instapay"
                      ? "Transfers usually reflect in real time. Make sure the account details are correct before you continue."
                      : "Transfers are usually processed in the next settlement cycle. Review cut-off reminders before you proceed."}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <span>Check the destination and amount before confirming.</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Customer support is available for assistance.</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setView("form")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF9A2F] py-4 text-sm font-semibold text-white"
            >
              Proceed <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        ) : view === "form" ? (
          <section className="rounded-[28px] border border-border bg-card p-4 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.24)]">
            <div className="rounded-[24px] border border-border/70 bg-background/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Recipient details
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {flow === "bills"
                      ? "Biller information"
                      : flow === "top-mobile"
                        ? "Mobile transfer"
                        : flow === "top-account"
                          ? "Account transfer"
                          : flow === "instapay"
                            ? "InstaPay transfer"
                            : flow === "pesonet"
                              ? "PESONet transfer"
                              : "Transfer details"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#FF9A2F]/10 p-3 text-[#FF9A2F]">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {flow === "bills" ? (
                  <>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Biller
                      </label>
                      <input
                        value={formData.biller}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, biller: e.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                        placeholder="e.g. Meralco"
                      />
                      {errors.biller && (
                        <p className="mt-1 text-xs text-destructive">{errors.biller}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Account / Reference Number
                      </label>
                      <input
                        value={formData.reference}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, reference: e.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                        placeholder="Reference number"
                      />
                      {errors.reference && (
                        <p className="mt-1 text-xs text-destructive">{errors.reference}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {flow === "top-mobile" ? "Recipient Mobile Number" : "Recipient Bank"}
                      </label>
                      {flow === "top-mobile" ? (
                        <input
                          value={formData.recipientMobile}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, recipientMobile: e.target.value }))
                          }
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                          placeholder="09XX XXX XXXX"
                        />
                      ) : (
                        <select
                          value={formData.recipientBank}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, recipientBank: e.target.value }))
                          }
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                        >
                          <option value="Top Bank">Top Bank</option>
                          <option value="BDO">BDO</option>
                          <option value="Metro Bank">Metro Bank</option>
                          <option value="BPI">BPI</option>
                        </select>
                      )}
                      {errors.recipientMobile && (
                        <p className="mt-1 text-xs text-destructive">{errors.recipientMobile}</p>
                      )}
                      {errors.recipientBank && (
                        <p className="mt-1 text-xs text-destructive">{errors.recipientBank}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {flow === "top-mobile" ? "Recipient Name" : "Account Name"}
                      </label>
                      <input
                        value={formData.recipientName}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, recipientName: e.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                        placeholder={
                          flow === "top-mobile" ? "Recipient name" : "Account holder name"
                        }
                      />
                      {errors.recipientName && (
                        <p className="mt-1 text-xs text-destructive">{errors.recipientName}</p>
                      )}
                    </div>
                    {flow !== "top-mobile" && (
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Account Number
                        </label>
                        <input
                          value={formData.recipientAccount}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              recipientAccount: e.target.value.replace(/[^0-9]/g, ""),
                            }))
                          }
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                          placeholder="Account number"
                        />
                        {errors.recipientAccount && (
                          <p className="mt-1 text-xs text-destructive">{errors.recipientAccount}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Amount
                  </label>
                  <div className="mt-2 flex items-center rounded-2xl border border-border bg-background px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">₱</span>
                    <input
                      value={formatAmountDisplay(formData.amount)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value.replace(/[^0-9.]/g, ""),
                        }))
                      }
                      inputMode="decimal"
                      className="ml-2 w-full bg-transparent text-2xl font-semibold outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ₱{formatCurrency(formData.amount)} · Available {account.label}
                  </p>
                  {errors.amount && (
                    <p className="mt-1 text-xs text-destructive">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Note / Purpose (optional)
                  </label>
                  <input
                    value={formData.note}
                    onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
                    placeholder="Add a note"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From account</span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{account.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Balance ₱{formatCurrency(account.balance)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF9A2F] py-4 text-sm font-semibold text-white"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </section>
        ) : view === "recent-all" ? (
          <section className="min-h-[60vh] rounded-[28px] border border-border bg-card p-4 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.24)]">
            <div className="mb-4 flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Recent Transfers
                </p>
                <h2 className="text-lg font-semibold text-foreground">All recent recipients</h2>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <label className="sr-only" htmlFor="recent-search">
                  Search recent recipients
                </label>
                <input
                  id="recent-search"
                  value={recentSearch}
                  onChange={(e) => setRecentSearch(e.target.value)}
                  placeholder="Search recipients, bank, or transfer type"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="space-y-3 overflow-y-auto pb-4">
              {recentFiltered.length === 0 ? (
                <div className="rounded-3xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                  No recent recipients match your search.
                </div>
              ) : (
                recentFiltered.map((recipient) => {
                  const isFavorite = favorites.includes(recipient.id);
                  return (
                    <button
                      key={recipient.id}
                      type="button"
                      onClick={() => openFlow(recipient.flow, recipient)}
                      className="flex w-full items-start gap-3 rounded-[22px] border border-border bg-card p-4 text-left shadow-sm transition hover:bg-muted"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FFF2E5] text-sm font-semibold text-[#FF9A2F] dark:bg-[#1f2937]">
                        {recipient.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {recipient.name}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            {recipient.lastUsed}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {recipient.bank} · {maskValue(recipient.detail)}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#FF9A2F]">
                          {recipient.type}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(recipient.id);
                        }}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors",
                          isFavorite && "bg-[#FF9A2F]/10 text-[#FF9A2F]",
                        )}
                      >
                        <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
                      </button>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        ) : view === "favorites-all" ? (
          <section className="min-h-[60vh] rounded-[28px] border border-border bg-card p-4 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.24)]">
            <div className="mb-4 flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Favorite Recipients
                </p>
                <h2 className="text-lg font-semibold text-foreground">All favorites</h2>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3">
                <label className="sr-only" htmlFor="favorite-search">
                  Search favorite recipients
                </label>
                <input
                  id="favorite-search"
                  value={favoriteSearch}
                  onChange={(e) => setFavoriteSearch(e.target.value)}
                  placeholder="Search favorites by name, bank, or transfer type"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="space-y-3 overflow-y-auto pb-4">
              {favoriteFiltered.length === 0 ? (
                <div className="rounded-3xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                  No favorite recipients match your search.
                </div>
              ) : (
                favoriteFiltered.map((recipient) => (
                  <button
                    key={recipient.id}
                    type="button"
                    onClick={() => openFlow(recipient.flow, recipient)}
                    className="flex w-full items-start gap-3 rounded-[22px] border border-border bg-card p-4 text-left shadow-sm transition hover:bg-muted"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FFF2E5] text-sm font-semibold text-[#FF9A2F] dark:bg-[#1f2937]">
                      {recipient.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {recipient.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {recipient.bank} · {maskValue(recipient.detail)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#FF9A2F]">{recipient.type}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(recipient.id);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-[#FF9A2F] transition-colors hover:bg-[#FF9A2F]/10"
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  </button>
                ))
              )}
            </div>
          </section>
        ) : view === "review" ? (
          <section className="rounded-[28px] border border-border bg-card p-5 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.24)]">
            <div className="rounded-[24px] border border-border/70 bg-background/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Review transfer
              </p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">Confirm your transfer</h3>
              <div className="mt-4 rounded-[22px] bg-muted/50 p-4">
                <SummaryRow label="Recipient" value={formData.recipientName || "Recipient"} />
                <SummaryRow label="Amount" value={`₱${formatCurrency(amountNum)}`} />
                <SummaryRow label="From" value={account.label} />
                <SummaryRow label="Method" value={headerTitle} />
                <SummaryRow label="Note" value={formData.note || "—"} />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={sending}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF9A2F] py-4 text-sm font-semibold text-white"
            >
              {sending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Processing…
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Confirm transfer
                </>
              )}
            </button>
          </section>
        ) : null}
      </div>

      {receipt && (
        <SuccessModal
          receipt={receipt}
          onClose={() => {
            setReceipt(null);
            setView("menu");
            setFlow(null);
            setActiveRecipient(null);
          }}
        />
      )}
    </MobileShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function TransferOptionCard({
  title,
  subtitle,
  icon,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-[24px] border border-border bg-card p-4 text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2E5] text-[#FF9A2F] dark:bg-[#1f2937]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function SuccessModal({ receipt, onClose }: { receipt: TransferReceipt; onClose: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const bills = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const startX = side * (100 + Math.random() * 60);
        const startY = -70 - Math.random() * 60;
        const endX = side * (30 + Math.random() * 50);
        const endY = -180 - Math.random() * 100;
        return {
          startX,
          startY,
          tx: endX,
          ty: endY,
          r0: Math.random() * 18 - 9,
          r1: side * (300 + Math.random() * 180) + (Math.random() * 45 - 22.5),
          delay: Math.random() * 0.2,
          scale: 0.62 + Math.random() * 0.5,
          opacity: 0.76 + Math.random() * 0.16,
          duration: 2.2 + Math.random() * 0.5,
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-t-[32px]">
        {bills.map((b, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 money-fly"
            style={
              {
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
                opacity: b.opacity,
                "--start-x": `${b.startX}px`,
                "--start-y": `${b.startY}px`,
                "--tx": `${b.tx}px`,
                "--ty": `${b.ty}px`,
                "--r0": `${b.r0}deg`,
                "--r1": `${b.r1}deg`,
              } as CSSProperties
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
                boxShadow: "0 0 10px rgba(255,215,120,0.8), 0 0 24px rgba(250,204,21,0.25)",
                animationDelay: `${s.delay}s`,
                "--sx": `${s.sx}px`,
                "--sy": `${s.sy}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[32px] bg-background p-6 pb-8 shadow-elevated"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full success-glow" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full gradient-emerald text-white success-pop">
              <Check className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mt-5 text-lg font-semibold tracking-tight">Transfer Successful</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Your money is on its way to {receipt.recipient.name}
          </p>
          <p className="mt-5 text-4xl font-bold tabular-nums tracking-tight">
            ₱{receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
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
              <ReceiptRow label="Method" value={receipt.method} />
              <ReceiptRow
                label="Status"
                value={<span className="font-semibold text-emerald">Completed</span>}
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
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF9A2F] py-4 text-sm font-semibold text-white"
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

function ReceiptRow({ label, value }: { label: string; value: ReactNode }) {
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
