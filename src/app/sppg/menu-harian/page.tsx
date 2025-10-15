import Link from "next/link";
import { getMenuHarianListAction, deleteMenuHarianAction } from "@/actions/menu-harian";
import { Button } from "@/components/ui/button";
import {ContainerTableMenuHarian} from "@/components/sppg/menu-harian/ContainerTableMenuHarian";

export default async function MenuHarianPage() {

  const result = await getMenuHarianListAction();

  if(result.success === false) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold">Menu Harian & Analisis Gizi</h1>
        <div className="flex justify-end mb-4">
          <Link href="/sppg/menu-harian/tambah">
            <Button>Tambah Menu Harian</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Menu Harian & Analisis Gizi</h1>
      <div className="flex justify-end mb-4">
        <Link href="/sppg/menu-harian/tambah">
          <Button>Tambah Menu Harian</Button>
        </Link>
      </div>
      <ContainerTableMenuHarian initialData= {result.data} />
    </div>
  );
}