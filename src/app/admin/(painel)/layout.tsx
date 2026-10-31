import Link from "next/link";
import { Suspense } from "react";
import { MenuAdmin } from "@/components/admin/MenuAdmin";
import { exigirAdmin } from "@/lib/auth";
import { getSite } from "@/lib/data";
import { sair } from "../login/actions";
import { IconeSetaCimaDireita } from "@/components/Icones";

async function NomeDaParoquia() {
  return (await getSite()).nomeCurto;
}

async function UsuarioLogado() {
  const { admin } = await exigirAdmin();
  return (
    <div className="space-y-2 text-xs text-mariano-200">
      <p className="truncate" title={admin.email}>{admin.email}</p>
      <form action={sair}>
        <button type="submit" className="rounded-md border border-mariano-700 px-3 py-1.5 font-medium text-white hover:bg-white/10 cursor-pointer">
          Sair
        </button>
      </form>
    </div>
  );
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="flex flex-col gap-6 bg-mariano-950 p-4 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:p-5">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin" className="block">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-ouro-400">Painel</span>
            <span className="block font-serif text-lg font-bold leading-tight text-white">
              <Suspense fallback="Painel"><NomeDaParoquia /></Suspense>
            </span>
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-mariano-200 hover:text-white lg:mt-2 lg:inline-block">
            Ver site <IconeSetaCimaDireita className="inline-block size-4" />
          </Link>
        </div>
        <MenuAdmin />
        <div className="hidden lg:mt-auto lg:block">
          <Suspense fallback={<div className="h-14" />}>
            <UsuarioLogado />
          </Suspense>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-6">{children}</div>
        <div className="mt-10 lg:hidden">
          <Suspense fallback={null}>
            <UsuarioLogado />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
