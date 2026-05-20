/**
 * RoleShell — route-level layout that renders AppShell ONCE around an Outlet.
 * Mounting the shell at the route layer means it isn't unmounted/rebuilt on every
 * sidebar click; only the content inside <Outlet/> changes.
 *
 * `chatActive` is derived from the URL so chat routes still get the no-padding
 * full-bleed layout without each page needing to opt in.
 */
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppShell } from "@/components/AppShell";

function PageFallback() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
      <div
        className="animate-spin"
        style={{
          width: 28,
          height: 28,
          border: "2px solid var(--sf-sf)",
          borderTopColor: "transparent",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

export function RoleShell() {
  const location = useLocation();
  const chatActive = /\/chat(\/|$)/.test(location.pathname);

  return (
    <AppShell chatActive={chatActive}>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
