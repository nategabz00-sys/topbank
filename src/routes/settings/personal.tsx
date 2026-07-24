import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/personal")({
  head: () => ({ meta: [{ title: "Personal information — Settings" }] }),
  component: Personal,
});

function Personal() {
  return (
    <MobileShell title="Personal information" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">
          This is a placeholder for Personal information.
        </p>
      </div>
    </MobileShell>
  );
}

export default Personal;
