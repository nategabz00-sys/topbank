import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  LogOut,
  Bell,
  Star,
  Fingerprint,
  Globe,
  Lock,
  User,
  CreditCard,
  Phone,
  MessageCircle,
  BookOpen,
  FileText,
  File,
  Sun,
  Moon,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { currentUser } from "@/lib/user";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Top Bank" },
      {
        name: "description",
        content: "Manage your account, security, and preferences on Top Bank.",
      },
    ],
  }),
  component: Settings,
});

function Row({
  icon: Icon,
  title,
  subtitle,
  to,
  onClick,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  to?: string;
  onClick?: () => void;
}) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF6EE] text-black">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {inner}
    </button>
  );
}

function Settings() {
  const { theme, toggle } = useTheme();
  const handleDeactivate = () => {
    if (confirm("Are you sure you want to deactivate this device?")) {
      // Placeholder: real deactivation logic should be handled by existing business logic
      alert("Device deactivated (placeholder)");
    }
  };

  return (
    <MobileShell>
      <div className="px-5 pt-10 space-y-6">
        <div className="rounded-3xl border border-border bg-card shadow-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#FFF6EE] text-[#FF9A2F] text-lg font-semibold">
              {currentUser.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{currentUser.name}</p>
              <p className="mt-1 text-xs text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="px-4 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Account
            </p>
            <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
              <Row
                icon={User}
                title="Personal information"
                subtitle="Name, email, phone"
                to="/settings/personal"
              />
              <div className="border-t border-border" />
              <Row icon={Lock} title="Change password" to="/settings/change-password" />
              <div className="border-t border-border" />
              <Row
                icon={Fingerprint}
                title="Biometric login"
                subtitle="Face ID / Fingerprint"
                to="/settings/biometric"
              />
              <div className="border-t border-border" />
              <Row icon={Phone} title="Deactivate device" onClick={handleDeactivate} />
              <div className="border-t border-border" />
              <button
                type="button"
                onClick={toggle}
                role="switch"
                aria-checked={theme === "dark"}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF6EE] text-black">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Theme</p>
                    <p className="text-xs text-muted-foreground">
                      {theme === "dark" ? "Dark mode" : "Light mode"}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "flex h-7 w-12 items-center rounded-full p-0.5 transition-colors",
                    theme === "dark" ? "bg-[#FF9A2F]/20" : "bg-[#FF9A2F]/10",
                  )}
                >
                  <span
                    className={cn(
                      "h-6 w-6 rounded-full shadow-sm transition-transform duration-200",
                      theme === "dark"
                        ? "translate-x-5 bg-[#FF9A2F]"
                        : "translate-x-0 bg-[#FF9A2F]",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>

          <div>
            <p className="px-4 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Help
            </p>
            <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
              <Row icon={MessageCircle} title="Contact" to="/settings/contact" />
              <div className="border-t border-border" />
              <Row icon={BookOpen} title="FAQ" to="/settings/faq" />
              <div className="border-t border-border" />
              <Row icon={FileText} title="Privacy Policy" to="/settings/privacy" />
              <div className="border-t border-border" />
              <Row icon={File} title="Terms & Conditions" to="/settings/terms" />
              <div className="border-t border-border" />
              <Row icon={Star} title="Licenses" to="/settings/licenses" />
            </div>
          </div>

          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-6 py-3 text-sm font-semibold text-destructive shadow-sm transition hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 text-destructive" />
            Sign out
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

export default Settings;
