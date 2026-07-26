import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { ScanQR } from "./qr/scan";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Payments — Top Bank" },
      { name: "description", content: "Scan and share QR codes for fast, secure payments." },
    ],
  }),
  component: QRScannerPage,
});

function QRScannerPage() {
  const location = useLocation();
  const isRootQrRoute = location.pathname === "/qr";

  return (
    <MobileShell title={isRootQrRoute ? "QR Scanner" : "QR"} back="/" hideNav>
      {isRootQrRoute ? <ScanQR /> : <Outlet />}
    </MobileShell>
  );
}
