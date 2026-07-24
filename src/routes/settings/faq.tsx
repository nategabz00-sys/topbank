import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/settings/faq")({
  head: () => ({ meta: [{ title: "FAQ — Settings" }] }),
  component: FAQ,
});

function FAQ() {
  return (
    <MobileShell title="FAQ" back="/settings">
      <div className="px-5 pt-4">
        <p className="text-sm text-muted-foreground">This is a placeholder for FAQ.</p>
      </div>
    </MobileShell>
  );
}

export default FAQ;
