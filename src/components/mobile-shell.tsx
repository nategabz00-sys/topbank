import type { ReactNode } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "./bottom-nav";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: ReactNode;
  title?: string;
  back?: string;
  hideNav?: boolean;
  headerRight?: ReactNode;
  className?: string;
}

export function MobileShell({
  children,
  title,
  back,
  hideNav,
  headerRight,
  className,
}: MobileShellProps) {
  const location = useLocation();
  const router = useRouter();
  const isQrMyRoute = location.pathname === "/qr/my";

  const handleBack = () => {
    if (isQrMyRoute) {
      router.history.back();
      return;
    }

    if (back) {
      router.navigate({ to: back });
    }
  };

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-[#FFF8F2] dark:bg-background text-foreground">
      {title && (
        <header className="flex h-14 items-center justify-between bg-transparent/60 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {(back || isQrMyRoute) && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <h1 className="text-base font-semibold tracking-tight">{title}</h1>
          </div>
          {/* top-right intentionally empty to keep header clean and body-integrated */}
          <div />
        </header>
      )}
      <main className={cn("flex-1 pb-28", className)}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
