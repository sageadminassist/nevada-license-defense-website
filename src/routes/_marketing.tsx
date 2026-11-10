import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteFooter } from "@/components/marketing/site-footer";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
