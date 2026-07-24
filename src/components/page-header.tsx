import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, Moon, Sun } from "lucide-react";
import { currentUser } from "@/lib/user";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, back, className }: PageHeaderProps) {
  const { theme, toggle } = useTheme();
  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("px-5 pt-4", className)}>
      <div className="flex items-center justify-between" style={{ height: 72 }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold"
              style={{ background: "linear-gradient(135deg,#FF9A2F,#FFC78A)" }}
            >
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald ring-2 ring-white" />
          </div>
          <div>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {back ? (
            <Link
              to={back}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-muted/90"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
          ) : null}

          <Link
            to="/settings"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/90 hover:text-foreground transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald" />
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/90 hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
