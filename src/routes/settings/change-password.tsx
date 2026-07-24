import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/change-password")({
  head: () => ({ meta: [{ title: "Change password — Settings" }] }),
  component: ChangePassword,
});

function ChangePassword() {
  return (
    <MobileShell title="Change password" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">This is a placeholder for Change password.</p>
      </div>
    </MobileShell>
  );
}

export default ChangePassword;
