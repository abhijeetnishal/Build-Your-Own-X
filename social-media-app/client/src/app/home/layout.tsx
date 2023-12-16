"use client";
import SideNavbar from "@/components/SideNavbar";
import SidePanel from "@/components/SidePanel";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";

function HomePageLayout({ children }: { children: React.ReactNode }) {
  const token = getCookie("token");

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="w-full h-full flex flex-row">
      {/* Include shared UI here e.g. a header or sidebar */}
      <SideNavbar />
      <section className="w-[calc(100%-600px)] h-full">{children}</section>
      <SidePanel />
    </main>
  );
}

export default HomePageLayout;
