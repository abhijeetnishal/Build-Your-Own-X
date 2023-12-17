"use client";
import IsAuthenticated from "@/components/ProtectRoute";
import SideNavbar from "@/components/SideNavbar";
import SidePanel from "@/components/SidePanel";

function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-full flex flex-row">
      {/* Include shared UI here e.g. a header or sidebar */}
      <SideNavbar />
      <section className="w-[calc(100%-600px)] h-full">{children}</section>
      <SidePanel />
    </main>
  );
}

export default IsAuthenticated(HomePageLayout);
