import Link from "next/link";
import { Cabecalho } from "@/components/Cabecalho";
import { IconeEstrela } from "@/components/Icones";
import { Rodape } from "@/components/Rodape";
import { botao } from "@/components/Ui";

export default function NotFound() {
  return (
    <>
      <Cabecalho />
      <main className="flex-1">
        <section className="mx-auto max-w-xl px-6 py-24 text-center">
          <IconeEstrela className="mx-auto size-8 text-ouro-400" />
          <h1 className="mt-4 font-serif text-4xl font-bold text-mariano-950">Página não encontrada</h1>
          <p className="mt-3 text-tinta/70">O endereço que você procurou não existe ou foi alterado.</p>
          <Link href="/" className={`${botao.primario} mt-8`}>Voltar ao início</Link>
        </section>
      </main>
      <Rodape />
    </>
  );
}
