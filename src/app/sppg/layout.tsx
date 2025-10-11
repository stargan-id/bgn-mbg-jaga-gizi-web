import { ReactNode } from "react";
import { SidebarSppg } from "@/components/sppg/SidebarSppg";
import { TopBarSppg } from "@/components/sppg/TopBarSppg";

export default function SppgLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar SPPG - static di kiri desktop, overlay di mobile */}
      <SidebarSppg />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Bar SPPG */}
        <TopBarSppg />
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
