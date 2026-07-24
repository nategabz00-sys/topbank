import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Settings" }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <MobileShell title="Privacy Policy" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">This is a placeholder for Privacy Policy.</p>
      </div>
    </MobileShell>
  );
}

export default Privacy;
