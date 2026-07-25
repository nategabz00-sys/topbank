import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ArrowLeftRight, QrCode, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Transfer" },
  { to: "/qr", icon: QrCode, label: "QR" },
  { to: "/cards", icon: CreditCard, label: "Cards" },
  { to: "/settings", icon: Settings, label: "Settings" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 px-3 sm:px-4">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-t-[30px] border border-border/70 bg-background/90 px-2 py-2 pb-0 shadow-[0_-14px_40px_-18px_rgba(15,23,42,0.24)] backdrop-blur-xl">
        <ul className="flex w-full items-center justify-between gap-1">
          {items.map(({ to, icon: Icon, label }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            const isQr = to === "/qr";

            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-2 transition-all duration-300 ease-out hover:-translate-y-0.5"
                >
                  <span
                    className={cn(
                      "flex items-center justify-center transition-all duration-300 ease-out",
                      isQr ? "h-12 w-12 rounded-full" : "h-11 w-11 rounded-2xl",
                      active
                        ? isQr
                          ? "bg-[#FF9A2F] text-white shadow-lg"
                          : "scale-[1.04] bg-[#FF9A2F] text-white shadow-[0_12px_24px_-10px_rgba(255,154,47,0.45)]"
                        : isQr
                          ? "bg-[#FF9A2F]/15 text-[#FF9A2F]"
                          : "text-muted-foreground group-hover:bg-muted/70 group-hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "transition-all duration-300 ease-out",
                        isQr ? "h-6 w-6" : "h-6 w-6",
                      )}
                      strokeWidth={2.2}
                    />
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-out",
                      active
                        ? "text-[#FF9A2F]"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
