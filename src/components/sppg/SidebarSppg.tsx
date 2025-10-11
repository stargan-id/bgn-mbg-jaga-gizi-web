"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ClipboardCheck, Box, Utensils, FileText, FileBadge, Bell, ChevronLeft, ChevronRight, Menu, ChefHat } from "lucide-react";
import { useSidebarSppgStore } from "@/stores/sidebarSppgStore";
import { Button } from "@/components/ui/button";

const menu = [
  { name: "Dashboard", href: "/sppg", icon: Home },
  { name: "Checklist Harian", href: "/sppg/checklist-harian", icon: ClipboardCheck },
  { name: "Bahan Baku", href: "/sppg/bahan-baku", icon: Box },
  { name: "Menu Harian", href: "/sppg/menu-harian", icon: Utensils },
  { name: "Kegiatan Pengolahan", href: "/sppg/kegiatan-pengolahan", icon: ChefHat },
  { name: "Laporan Harian", href: "/sppg/laporan-harian", icon: FileText },
  { name: "Dokumen Kepatuhan", href: "/sppg/dokumen", icon: FileBadge },
  { name: "Notifikasi", href: "/sppg/notifikasi", icon: Bell },
];

export function SidebarSppg() {
  const pathname = usePathname();
  const { open, toggle, setOpen } = useSidebarSppgStore();

  // Responsive: show overlay on mobile when sidebar open
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />
      {/* Sidebar */}
      <aside
        className={cn(
          "z-50 top-0 left-0 h-screen flex flex-col bg-gradient-to-b from-primary/90 to-primary/60 text-white shadow-xl border-r border-primary/20",
          open ? "w-64 px-4 py-8" : "w-16 px-2 py-4",
          "min-h-screen"
        )}
        aria-label="Sidebar SPPG"
      >
        {/* Minimize/Maximize Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Utensils className={cn("text-white/90", open ? "w-7 h-7" : "w-6 h-6")}/>
            {open && <span className="font-bold text-xl tracking-tight">JAGA GIZI</span>}
          </div>
          <Button variant="ghost" size="icon" className="text-white" onClick={toggle}>
            {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-white",
                pathname === item.href && "bg-white/20 text-white font-bold shadow",
                !open && "justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", !open && "mx-auto")} />
              {open && item.name}
            </Link>
          ))}
        </nav>
        {open && (
          <div className="mt-10 text-xs text-white/70">
            <span>PT STARGAN MITRA TEKNOLOGI</span>
          </div>
        )}
      </aside>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed z-50 bottom-6 left-4 lg:hidden bg-primary text-white shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Buka menu SPPG"
      >
        <Menu className="w-6 h-6" />
      </Button>
    </>
  );
}
