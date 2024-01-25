import SideNavbar from "@/components/SideNavbar";
import SidePanel from "@/components/SidePanel";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function HomeLayout({ children }: { children: React.ReactNode }) {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token");

  if (!token) {
    redirect("/login");
  } 

  return (
    <main className="w-full h-full flex flex-row">
      {/* Include shared UI here e.g. a header or sidebar */}
      <SideNavbar />
      <section className="w-[calc(100%-600px)] lg:w-[calc(100%-600px)] md:w-[calc(100%-250px)] sm:w-[calc(100%-250px)] xs:w-[calc(100%-250px)] h-full">
        {children}
      </section>
      <section className="flex xl:flex lg:flex md:hidden sm:hidden xs:hidden">
        <SidePanel />
      </section>
    </main>
  );
}

export default HomeLayout;
