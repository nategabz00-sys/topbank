import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Home, User, Truck, Zap } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/loans")({
  head: () => ({
    meta: [
      { title: "Loans — Top Bank" },
      { name: "description", content: "Explore loan products available from Top Bank." },
    ],
  }),
  component: Loans,
});

const loanProducts = [
  {
    title: "Personal Loan",
    description: "Flexible funding for everyday needs.",
    icon: User,
    cta: "Learn More",
  },
  {
    title: "Salary Loan",
    description: "Fast approval for payroll customers.",
    icon: Zap,
    cta: "Apply Now",
  },
  {
    title: "Auto Loan",
    description: "Finance your next vehicle with ease.",
    icon: Truck,
    cta: "Learn More",
  },
  {
    title: "Home Loan",
    description: "Competitive rates for your dream home.",
    icon: Home,
    cta: "Apply Now",
  },
];

function Loans() {
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
              Loans
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Loan services</h1>
          </div>
        </div>

        <div className="mb-5 rounded-3xl border border-border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">
            Discover the best loan products for personal, salary, auto, and home financing.
          </p>
        </div>

        <div className="space-y-3">
          {loanProducts.map((loan) => {
            const Icon = loan.icon;
            return (
              <div
                key={loan.title}
                className="rounded-3xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FFF2E5] text-[#FF9A2F]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{loan.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{loan.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground">
                    {loan.cta}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Instant preview
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
