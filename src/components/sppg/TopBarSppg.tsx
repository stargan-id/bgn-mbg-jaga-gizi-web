import { Button } from "@/components/ui/button";
import { AvatarProfileSppg } from "./AvatarProfileSppg";
import { NotifikasiDropdownSppg } from "./NotifikasiDropdownSppg";

export function TopBarSppg() {
  return (
    <header className="px-6 py-4 border-b bg-white/80 backdrop-blur flex items-center justify-between shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">SPPG Operasional</h1>
        <span className="text-sm text-muted-foreground">Panel pelaksanaan operasional harian SPPG</span>
      </div>
      <div className="flex items-center gap-4">
        <NotifikasiDropdownSppg />
        <AvatarProfileSppg />
      </div>
    </header>
  );
}
