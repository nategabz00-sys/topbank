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
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between px-3 py-3">
        {items.map(({ to, icon: Icon, label }, index) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          const isQr = to === "/qr";

          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-label={label}
                className="group flex flex-col items-center gap-1 rounded-2xl px-1 py-1 transition-colors"
              >
                <span
                  className={cn(
                    "flex items-center justify-center transition-all duration-200",
                    isQr ? "h-12 w-12 rounded-full" : "h-11 w-11 rounded-2xl",
                    active
                      ? isQr
                        ? "bg-[#FF9A2F] text-white shadow-lg"
                        : "bg-[#FF9A2F] text-white"
                      : isQr
                        ? "bg-[#FF9A2F]/15 text-[#FF9A2F]"
                        : "text-muted-foreground group-hover:bg-muted",
                  )}
                >
                  <Icon
                    className={cn("transition-all duration-200", isQr ? "h-6 w-6" : "h-5 w-5")}
                    strokeWidth={2.2}
                  />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wide transition-colors",
                    active ? "text-[#FF9A2F]" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
