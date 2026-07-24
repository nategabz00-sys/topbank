import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/licenses")({
  head: () => ({ meta: [{ title: "Licenses — Settings" }] }),
  component: Licenses,
});

function Licenses() {
  return (
    <MobileShell title="Licenses" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">This is a placeholder for Licenses.</p>
      </div>
    </MobileShell>
  );
}

export default Licenses;
