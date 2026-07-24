import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, QrCode, ScanLine, Share2 } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Payments — Top Bank" },
      { name: "description", content: "Scan and share QR codes for fast, secure payments." },
    ],
  }),
  component: QRPayments,
});

function QRPayments() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isQrHome = pathname === "/qr";
  const title =
    pathname === "/qr/scan" ? "Scan QR" : pathname === "/qr/my" ? "My QR" : "QR Payments";
  const back = isQrHome ? "/" : "/qr";

  return (
    <MobileShell title={title} back={back} hideNav>
      {isQrHome ? (
        <div className="bg-[#FFF8F2] dark:bg-background min-h-full px-5 pb-6 pt-5">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Scan a code to send money instantly or share your personal QR to receive it.
            </p>

            <div className="grid gap-4">
              <Link
                to="/qr/scan"
                className="group block overflow-hidden rounded-3xl border border-border bg-white px-5 py-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Scan QR</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Send money by scanning another user’s code
                    </p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FF9A2F]/10 text-[#FF9A2F] shadow-sm">
                    <ScanLine className="h-5 w-5" />
                  </span>
                </div>
              </Link>

              <Link
                to="/qr/my"
                className="group block overflow-hidden rounded-3xl border border-border bg-white px-5 py-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">My QR</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Show your personal code to receive money
                    </p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#FF9A2F]/10 text-[#FF9A2F] shadow-sm">
                    <QrCode className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </div>

            <div className="rounded-3xl border border-border bg-white p-5 shadow-card dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Need help?</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Get support for QR payments and transfers.
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-[#FF9A2F] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ff7a2f]">
                  <Share2 className="h-4 w-4" />
                  Share guide
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </MobileShell>
  );
}
