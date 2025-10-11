import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotifikasiDropdownSppg() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-0 h-5">2</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex flex-col items-start p-3">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-sm">Checklist belum lengkap</span>
            <span className="text-xs text-gray-500">5 menit lalu</span>
          </div>
          <span className="text-sm text-gray-600 mt-1">Mohon lengkapi checklist pagi hari ini.</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start p-3">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-sm">Bahan baku diterima</span>
            <span className="text-xs text-gray-500">30 menit lalu</span>
          </div>
          <span className="text-sm text-gray-600 mt-1">Bahan baku "Ayam" sudah diterima dan diverifikasi.</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center p-2">
          <span className="text-sm text-blue-600 hover:text-blue-800">Lihat semua notifikasi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
