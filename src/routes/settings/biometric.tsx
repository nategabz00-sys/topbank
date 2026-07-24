import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/biometric")({
  head: () => ({ meta: [{ title: "Biometric login — Settings" }] }),
  component: Biometric,
});

function Biometric() {
  const [enabled, setEnabled] = useState(true);
  return (
    <MobileShell title="Biometric login" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">Face ID / Fingerprint</p>
        <div className="mt-4">
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setEnabled((v) => !v)}
              className="toggle"
            />
            <span className="text-sm">Enable biometric authentication</span>
          </label>
        </div>
      </div>
    </MobileShell>
  );
}

export default Biometric;
