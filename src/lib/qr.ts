import QRCode from "qrcode";
import jsQR from "jsqr";

export interface QRRecipient {
  name: string;
  tag: string;
  account: string;
  bank: string;
  ref?: string;
}

export interface QRPaymentPayload {
  type: "topbank-pay";
  recipient: QRRecipient;
  amount?: number;
}

export function buildTransferUrl(payload: QRPaymentPayload) {
  const search = new URLSearchParams({
    recipientName: payload.recipient.name,
    recipientTag: payload.recipient.tag,
    account: payload.recipient.account,
    bank: payload.recipient.bank,
    ref: payload.recipient.ref ?? "",
  });

  if (payload.amount != null) {
    search.set("amount", payload.amount.toString());
  }

  return `/transfer?${search.toString()}`;
}

export async function decodeQRCodeFromImageFile(file: File): Promise<string | null> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas context.");
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return await decodeQRCodeFromCanvas(canvas, ctx);
}

export async function decodeQRCodeFromCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<string | null> {
  const supported = typeof window !== "undefined" && "BarcodeDetector" in window;
  if (supported) {
    try {
      const Detector = (window as any).BarcodeDetector;
      const detector = new Detector({ formats: ["qr_code"] });
      const results = await detector.detect(canvas);
      if (results.length > 0 && results[0].rawValue) {
        return results[0].rawValue as string;
      }
    } catch (error) {
      console.warn("BarcodeDetector failed:", error);
    }
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const qr = jsQR(imageData.data, imageData.width, imageData.height);
  if (qr?.data) {
    return qr.data;
  }

  return null;
}

export async function decodeQRCodeFromVideoFrame(video: HTMLVideoElement): Promise<string | null> {
  const supported = typeof window !== "undefined" && "BarcodeDetector" in window;

  if (supported) {
    try {
      const Detector = (window as any).BarcodeDetector;
      const detector = new Detector({ formats: ["qr_code"] });
      const results = await detector.detect(video);
      if (results.length > 0 && results[0].rawValue) {
        return results[0].rawValue as string;
      }
    } catch (error) {
      console.warn("BarcodeDetector video detection failed:", error);
    }
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create canvas context.");
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return await decodeQRCodeFromCanvas(canvas, ctx);
}

export function parseQRPayload(data: string): QRPaymentPayload {
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    throw new Error("QR code data is not valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("QR code data is invalid.");
  }

  const payload = parsed as Partial<QRPaymentPayload>;
  if (payload.type !== "topbank-pay" || !payload.recipient) {
    throw new Error("QR code is not a valid Top Bank payment code.");
  }

  const recipient = payload.recipient as Partial<QRRecipient>;
  if (
    typeof recipient.name !== "string" ||
    typeof recipient.tag !== "string" ||
    typeof recipient.account !== "string" ||
    typeof recipient.bank !== "string"
  ) {
    throw new Error("QR code recipient information is incomplete.");
  }

  return {
    type: "topbank-pay",
    recipient: {
      name: recipient.name,
      tag: recipient.tag,
      account: recipient.account,
      bank: recipient.bank,
      ref: typeof recipient.ref === "string" ? recipient.ref : undefined,
    },
    amount: typeof payload.amount === "number" && payload.amount > 0 ? payload.amount : undefined,
  };
}

export async function createQRCodeDataUrl(payload: QRPaymentPayload) {
  return QRCode.toDataURL(JSON.stringify(payload), {
    margin: 1,
    width: 320,
    color: {
      dark: "#0B1E3F",
      light: "#FFFFFF",
    },
  });
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image file."));
    };

    image.src = url;
  });
}
