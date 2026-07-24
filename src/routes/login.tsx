import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Fingerprint, Eye, EyeOff, ArrowRight } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import logoAsset from "@/assets/top-bank-logo-official.jpg.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Top Bank" },
      { name: "description", content: "Sign in securely to your Top Bank account." },
      { property: "og:title", content: "Sign in — Top Bank" },
      { property: "og:description", content: "Sign in securely to your Top Bank account." },
    ],
  }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <MobileShell hideNav>
      <div className="flex min-h-dvh flex-col px-6 pt-10 pb-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Top Bank logo"
            width={88}
            height={88}
            className="h-22 w-22 drop-shadow-[0_8px_24px_rgba(242,140,40,0.35)]"
          />
          <span className="text-base font-semibold tracking-tight text-foreground">Top Bank</span>
        </div>

        <div className="mt-10 text-center float-in">
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            Welcome back<span className="text-emerald">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your banking journey.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/" });
          }}
          className="mt-8 space-y-4"
        >
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Email or username</span>
            <input
              type="text"
              defaultValue="alexis.cruz"
              className="mt-1.5 w-full rounded-2xl border border-input bg-surface-2 px-4 py-3.5 text-sm font-medium outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <div className="relative mt-1.5">
              <input
                type={show ? "text" : "password"}
                defaultValue="••••••••••"
                className="w-full rounded-2xl border border-input bg-surface-2 px-4 py-3.5 pr-12 text-sm font-medium outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-medium text-emerald hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl gradient-emerald py-4 text-sm font-semibold text-emerald-foreground shadow-glow transition-transform active:scale-[0.98]"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <Fingerprint className="h-5 w-5 text-emerald" /> Sign in with biometrics
          </button>
        </form>

        <div className="mt-auto pt-10 text-center text-xs text-muted-foreground">
          New to Top Bank?{" "}
          <Link to="/register" className="font-semibold text-emerald hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
