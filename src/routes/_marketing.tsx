import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Analytics } from "@/components/marketing/analytics";
import { ConsultModal } from "@/components/marketing/consult-modal";
import { FaqChat } from "@/components/marketing/faq-chat";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ConsultModal />
      <FaqChat />
      <Analytics />
    </div>
  );
}
