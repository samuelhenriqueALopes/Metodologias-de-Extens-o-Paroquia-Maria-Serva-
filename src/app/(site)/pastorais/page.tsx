import type { Metadata } from "next";
import Link from "next/link";
import { IconeSeta, iconesPastorais } from "@/components/Icones";
import { CabecalhoPagina } from "@/components/Ui";
import { pastorais } from "@/content/pastorais";

export const metadata: Metadata = {
  title: "Pastorais",
  description: "Conheça as pastorais e serviços da paróquia e saiba como participar.",
};

export default function PastoraisPage() {
  return (
    <>
      <CabecalhoPagina sobretitulo="Sirva na comunidade" titulo="Pastorais e Serviços"
        subtitulo="Cada um tem um dom a oferecer. Encontre o seu lugar e venha servir conosco." />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <ul className="grid gap-6 sm:grid-cols-2">
          {pastorais.map((p) => {
            const Icone = iconesPastorais[p.icone];
            return (
              <li key={p.slug}>
                <Link href={`/pastorais/${p.slug}`}
                  className="group flex h-full gap-5 rounded-2xl border border-mariano-100 bg-white p-6 shadow-sm transition hover:border-mariano-300 hover:shadow-md">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-mariano-900 text-ouro-300">
                    <Icone className="size-7" />
                  </span>
                  <span>
                    <span className="block font-serif text-2xl font-bold text-mariano-950">{p.nome}</span>
                    <span className="mt-1 block text-sm text-tinta/70">{p.resumo}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mariano-700 group-hover:text-mariano-900">
                      Saiba mais e participe <IconeSeta className="size-4" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
