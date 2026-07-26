import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScanLine, Upload, ArrowRight, QrCode } from "lucide-react";
import { toast } from "sonner";
import {
  buildTransferUrl,
  decodeQRCodeFromImageFile,
  decodeQRCodeFromVideoFrame,
  parseQRPayload,
  QRPaymentPayload,
} from "@/lib/qr";

export const Route = createFileRoute("/qr/scan")({
  head: () => ({
    meta: [
      { title: "Scan QR — Top Bank" },
      { name: "description", content: "Scan a QR code to send money quickly and securely." },
    ],
  }),
  component: ScanQR,
});

export function ScanQR() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState("scanning");
  const [message, setMessage] = useState("Point the camera at a QR code to scan.");
  const [busy, setBusy] = useState(false);
  const [supportsCamera, setSupportsCamera] = useState(true);
  const [scanning, setScanning] = useState(true);

  const clearStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const navigateToTransfer = (payload: QRPaymentPayload) => {
    const url = buildTransferUrl(payload);
    navigate({ to: url });
  };

  useEffect(() => {
    let frameId = 0;
    let active = true;

    const scanFrame = async () => {
      const video = videoRef.current;
      if (!active || !video || video.readyState < 2 || status === "error") {
        frameId = requestAnimationFrame(scanFrame);
        return;
      }

      try {
        const result = await decodeQRCodeFromVideoFrame(video);
        if (result) {
          const payload = parseQRPayload(result);
          clearStream();
          navigateToTransfer(payload);
          return;
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to read the QR code from camera.";
        setStatus("error");
        setMessage(message);
        toast.error(message);
        clearStream();
        return;
      }

      frameId = requestAnimationFrame(scanFrame);
    };

    const startCamera = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setStream(media);
        setScanning(true);
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          await videoRef.current.play();
        }
        frameId = requestAnimationFrame(scanFrame);
      } catch (error) {
        setSupportsCamera(false);
        setScanning(false);
        setStatus("error");
        setMessage("Camera access is unavailable. Upload a QR image instead.");
      }
    };

    startCamera();

    const timeoutId = window.setTimeout(() => {
      if (active && scanning && status === "scanning") {
        setStatus("timeout");
        setMessage("Still no code found. Move the device slowly or upload an image.");
      }
    }, 20000);

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      clearStream();
      window.clearTimeout(timeoutId);
    };
  }, [navigate, scanning, status]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setStatus("scanning");
    setMessage("Decoding QR image...");

    try {
      const decoded = await decodeQRCodeFromImageFile(file);
      if (!decoded) {
        throw new Error("No QR code found in the image.");
      }
      const payload = parseQRPayload(decoded);
      toast.success("QR code decoded successfully");
      clearStream();
      navigateToTransfer(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid QR code image.";
      setStatus("error");
      setMessage(message);
      toast.error(message);
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const handleRetryCamera = async () => {
    clearStream();
    setStatus("scanning");
    setMessage("Point the camera at a QR code to scan.");
    setSupportsCamera(true);
    setScanning(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play();
      }
    } catch (error) {
      setSupportsCamera(false);
      setScanning(false);
      setStatus("error");
      setMessage("Camera access is unavailable. Upload a QR image instead.");
    }
  };

  const renderStatus = useMemo(() => {
    const isActiveScan = status === "scanning" || status === "timeout";

    return (
      <div
        className={
          isActiveScan
            ? "flex items-center gap-3 rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground"
            : "rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200"
        }
      >
        {isActiveScan && (
          <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-[#FF9A2F]/30 border-t-[#FF9A2F]" />
        )}
        <span>{message}</span>
      </div>
    );
  }, [message, status]);

  return (
    <div className="flex min-h-full flex-col bg-[#FFF8F2] px-3 pb-3 pt-3 dark:bg-background">
      <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-border bg-black shadow-card">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_40%,rgba(15,23,42,0.28)_100%)]" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 rounded-[2.2rem] border-[3px] border-[#FF9A2F]/85 shadow-[0_0_0_9999px_rgba(15,23,42,0.28)]" />
        </div>

        <div className="absolute inset-x-3 top-3">{renderStatus}</div>

        {!supportsCamera && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 px-6 text-center text-sm text-muted-foreground">
            Camera unavailable. Upload an image to proceed.
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-20 mt-3 rounded-[28px] border border-border/70 bg-[#FFF8F2]/95 p-3 shadow-[0_-10px_30px_-18px_rgba(15,23,42,0.32)] backdrop-blur dark:bg-background/95">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/qr/my" })}
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-border bg-white px-3 py-3 text-sm font-semibold text-foreground shadow-card transition hover:bg-muted dark:bg-slate-900"
          >
            <QrCode className="h-4 w-4" /> My QR
          </button>
          <button
            type="button"
            onClick={triggerUpload}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#FF9A2F] px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ff7a2f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> Upload QR
          </button>
        </div>
        {status === "error" && (
          <button
            type="button"
            onClick={handleRetryCamera}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-[#FF9A2F]/30 bg-[#FF9A2F]/10 px-4 py-3 text-sm font-semibold text-[#FF9A2F] transition hover:bg-[#FF9A2F]/20"
          >
            <ArrowRight className="h-4 w-4" /> Retry camera
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
