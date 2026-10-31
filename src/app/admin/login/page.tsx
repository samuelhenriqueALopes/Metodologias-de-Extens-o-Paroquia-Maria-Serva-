import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { supabaseConfigurado } from "@/lib/auth";
import { getSite } from "@/lib/data";
import { FormLogin } from "./FormLogin";
import { IconeSetaEsquerda } from "@/components/Icones";

export const metadata: Metadata = { title: "Entrar" };

async function Formulario({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { erro } = await searchParams;
  const aviso = !supabaseConfigurado()
    ? "O Supabase ainda não foi configurado (.env.local)."
    : erro === "acesso"
      ? "Este usuário não tem acesso ao painel."
      : undefined;
  return <FormLogin avisoInicial={aviso} />;
}

export default async function LoginPage(props: PageProps<"/admin/login">) {
  const site = await getSite();
  return (
    <main className="grid min-h-full flex-1 place-items-center bg-mariano-400 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="relative size-16 overflow-hidden rounded-full bg-mariano-400 ring-2 ring-ouro-400/70">
            <Image src="/images/logo.png" alt="" fill sizes="64px" quality={90} className="object-cover" />
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-mariano-950">Painel da Secretaria</h1>
          <p className="text-sm text-tinta/60">{site.nome}</p>
        </div>
        <div className="mt-6">
          <Suspense fallback={<div className="h-56" />}>
            <Formulario searchParams={props.searchParams} />
          </Suspense>
        </div>
        <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-center text-xs text-mariano-700 hover:underline"><IconeSetaEsquerda className="size-4" /> Voltar ao site</Link>
      </div>
    </main>
  );
}
