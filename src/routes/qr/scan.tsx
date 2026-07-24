import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScanLine, Upload, ArrowRight, ArrowLeft } from "lucide-react";
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

function ScanQR() {
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
    <div className="bg-[#FFF8F2] dark:bg-background min-h-full px-5 pb-6 pt-6">
      <div className="space-y-5">
        <div className="rounded-3xl border border-border bg-white p-4 shadow-card dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Scan or upload a QR code</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The app will prefill the recipient and take you to transfer.
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#FF9A2F]/10 text-[#FF9A2F] shadow-sm">
              <ScanLine className="h-5 w-5" />
            </span>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-border bg-slate-100 dark:bg-slate-800">
            <video ref={videoRef} className="h-72 w-full object-cover" muted playsInline />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 bg-[#FF9A2F] opacity-80 shadow-glow" />
            {!supportsCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm text-muted-foreground">
                Camera unavailable. Upload an image to proceed.
              </div>
            )}
          </div>
        </div>

        {renderStatus}

        <div className="grid gap-3">
          <button
            type="button"
            onClick={triggerUpload}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-border bg-white px-4 py-4 text-sm font-semibold text-foreground shadow-card transition hover:bg-muted dark:bg-slate-900"
          >
            <Upload className="h-4 w-4" /> Upload QR image
          </button>
          {status === "error" && (
            <button
              type="button"
              onClick={handleRetryCamera}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#FF9A2F] px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ff7a2f]"
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
    </div>
  );
}
