import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/contact")({
  head: () => ({ meta: [{ title: "Contact — Settings" }] }),
  component: Contact,
});

function Contact() {
  return (
    <MobileShell title="Contact" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">This is a placeholder for Contact.</p>
      </div>
    </MobileShell>
  );
}

export default Contact;
