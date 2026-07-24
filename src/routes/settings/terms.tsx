import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Settings" }] }),
  component: Terms,
});

function Terms() {
  return (
    <MobileShell title="Terms & Conditions" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">
          This is a placeholder for Terms & Conditions.
        </p>
      </div>
    </MobileShell>
  );
}

export default Terms;
