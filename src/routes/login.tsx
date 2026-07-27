import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Fingerprint, Eye, EyeOff } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { Logo } from "@/components/logo";

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
      <div
        className="flex min-h-dvh flex-col items-center px-6 pt-10 pb-8"
        style={{ backgroundColor: "#F5EFE7" }}
      >
        {/* Logo - Main focal point */}
        <Logo size="4xl" withLabel={false} />

        {/* TOPBANK Text */}
        <div className="mt-2">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1e3a8a" }}>
            TOPBANK
          </h2>
        </div>

        {/* Welcome Section */}
        <div className="mt-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
            Welcome Back
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#666666" }}>
            Enter your credentials
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/" });
          }}
          className="mt-8 w-full max-w-sm space-y-5"
        >
          {/* Email Field - Hidden but kept for functionality */}
          <label className="hidden">
            <span className="text-xs font-medium text-muted-foreground">Email or username</span>
            <input
              type="text"
              defaultValue="alexis.cruz"
              className="mt-1.5 w-full rounded-2xl border border-input bg-surface-2 px-4 py-3.5 text-sm font-medium outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20"
            />
          </label>

          {/* Password Field */}
          <div>
            <label className="block">
              <span className="text-xs font-medium" style={{ color: "#1a1a1a" }}>
                Password
              </span>
            </label>
            <div className="relative mt-2">
              <input
                type={show ? "text" : "password"}
                defaultValue="••••••••••"
                className="w-full rounded-3xl border border-gray-300 bg-white px-4 py-3.5 pr-12 text-sm font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                style={{ color: "#1a1a1a" }}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-medium hover:underline transition-colors"
              style={{ color: "#FF6B35" }}
            >
              Forgot Password ?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white transition-transform active:scale-[0.98] shadow-md hover:shadow-lg"
            style={{ backgroundColor: "#FF6B35" }}
          >
            Sign In
          </button>

          {/* Sign in with Biometrics Button */}
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <Fingerprint className="h-5 w-5" style={{ color: "#FF6B35" }} /> Sign in with biometrics
          </button>
        </form>

        {/* Bottom Text */}
        {/* <div className="mt-auto pt-12 text-center text-xs">
          <span style={{ color: "#666666" }}>New to Top Bank? </span>
          <Link
            to="/register"
            className="font-semibold hover:underline transition-colors"
            style={{ color: "#FF6B35" }}
          >
            Create an Account
          </Link>
        </div> */}
      </div>
    </MobileShell>
  );
}
