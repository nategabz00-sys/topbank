import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QrCode, Download, Share2 } from "lucide-react";
import { createQRCodeDataUrl, downloadDataUrl, QRPaymentPayload } from "@/lib/qr";
import { currentUser } from "@/lib/user";

export const Route = createFileRoute("/qr/my")({
  head: () => ({
    meta: [
      { title: "My QR — Top Bank" },
      { name: "description", content: "Display your personal QR code to receive money." },
    ],
  }),
  component: MyQR,
});

function MyQR() {
  const personalPayload: QRPaymentPayload = {
    type: "topbank-pay",
    recipient: {
      name: currentUser.name,
      tag: currentUser.tag,
      account: currentUser.account,
      bank: currentUser.bank,
      ref: currentUser.ref,
    },
  };
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("Generating your QR code...");

  useEffect(() => {
    let active = true;
    createQRCodeDataUrl(personalPayload)
      .then((url) => {
        if (active) {
          setQrDataUrl(url);
          setStatus("Your personal QR is ready.");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("Unable to generate QR code. Please try again later.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    downloadDataUrl("topbank-qr.png", qrDataUrl);
  };

  const shareQR = async () => {
    if (!qrDataUrl) return;

    try {
      const blob = await fetch(qrDataUrl).then((response) => response.blob());
      const file = new File([blob], "topbank-qr.png", { type: blob.type });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Top Bank QR",
          text: "Scan this code to send money to me.",
          files: [file],
        });
        toast.success("QR shared successfully");
        return;
      }
    } catch {
      // ignore and fallback to clipboard
    }

    try {
      await navigator.clipboard.writeText(qrDataUrl);
      toast.success("QR image copied to clipboard");
    } catch {
      toast.error("Unable to share your QR code. Please save it instead.");
    }
  };

  return (
    <div className="bg-[#FFF8F2] dark:bg-background min-h-full px-5 pb-6 pt-6">
      <div className="rounded-3xl border border-border bg-white p-5 shadow-card dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Receive money with your QR</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Share this code and get paid instantly.
            </p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#FF9A2F]/10 text-[#FF9A2F] shadow-sm">
            <QrCode className="h-5 w-5" />
          </span>
        </div>

        <div className="mb-6 flex flex-col items-center gap-4 rounded-3xl bg-slate-100 p-6 dark:bg-slate-800">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Personal QR code"
              className="h-60 w-60 rounded-3xl bg-white shadow-card"
            />
          ) : (
            <div className="flex h-60 w-60 items-center justify-center rounded-3xl bg-slate-200 text-sm text-muted-foreground dark:bg-slate-700">
              {status}
            </div>
          )}
          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">
              Account {currentUser.account} · {currentUser.bank}
            </p>
            {currentUser.ref && (
              <p className="text-xs text-muted-foreground">Reference ID: {currentUser.ref}</p>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={downloadQR}
            disabled={!qrDataUrl}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#FF9A2F] px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ff7a2f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> Download QR
          </button>
          <button
            type="button"
            onClick={shareQR}
            disabled={!qrDataUrl}
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-border bg-card px-4 py-4 text-sm font-semibold text-foreground shadow-card transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Share2 className="h-4 w-4" /> Share QR
          </button>
        </div>
      </div>
    </div>
  );
}
