import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, User, Mail, Phone, AtSign, Lock } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import logoAsset from "@/assets/top-bank-logo-official.jpg.asset.json";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Top Bank" },
      { name: "description", content: "Open your Top Bank account in minutes." },
      { property: "og:title", content: "Create account — Top Bank" },
      { property: "og:description", content: "Open your Top Bank account in minutes." },
    ],
  }),
  component: Register,
});

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  trailing?: React.ReactNode;
}

function Field({ label, type = "text", placeholder, icon: Icon, value, onChange, trailing }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-input bg-surface-2 px-4 py-3.5 pl-11 pr-12 text-sm font-medium outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
        />
        {trailing}
      </div>
    </label>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <MobileShell hideNav>
      <div className="flex min-h-dvh flex-col px-6 pt-8 pb-8">
        <div className="flex flex-col items-center gap-2">
          <img
            src={logoAsset.url}
            alt="Top Bank logo"
            width={64}
            height={64}
            className="h-16 w-16 drop-shadow-[0_8px_24px_rgba(242,140,40,0.3)]"
          />
          <span className="text-sm font-semibold tracking-tight text-foreground">Top Bank</span>
        </div>

        <div className="mt-6 text-center float-in">
          <h1 className="text-2xl font-bold tracking-tight leading-tight">
            Create your account<span className="text-emerald">.</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join Top Bank in just a few steps.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.password !== form.confirm) {
              setError("Passwords do not match.");
              return;
            }
            if (!form.firstName || !form.email || !form.password) {
              setError("Please fill in all required fields.");
              return;
            }
            setError(null);
            navigate({ to: "/" });
          }}
          className="mt-6 space-y-3.5"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" icon={User} placeholder="Alexis" value={form.firstName} onChange={set("firstName")} />
            <Field label="Last name" icon={User} placeholder="Cruz" value={form.lastName} onChange={set("lastName")} />
          </div>
          <Field label="Email address" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={set("email")} />
          <Field label="Mobile number" type="tel" icon={Phone} placeholder="+63 917 000 0000" value={form.mobile} onChange={set("mobile")} />
          <Field label="Username" icon={AtSign} placeholder="alexis.cruz" value={form.username} onChange={set("username")} />
          <Field
            label="Password"
            type={show ? "text" : "password"}
            icon={Lock}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={set("password")}
            trailing={
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <Field
            label="Confirm password"
            type={showConfirm ? "text" : "password"}
            icon={Lock}
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={set("confirm")}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl gradient-emerald py-4 text-sm font-semibold text-emerald-foreground shadow-glow transition-transform active:scale-[0.98]"
          >
            Create account <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-auto pt-8 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
