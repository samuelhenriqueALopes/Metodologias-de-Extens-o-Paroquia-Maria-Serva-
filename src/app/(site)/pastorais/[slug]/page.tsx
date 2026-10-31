import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormularioInscricao } from "@/components/FormularioInscricao";
import { IconeCalendario, IconeCheck, IconeExterno, IconeSetaEsquerda, IconeWhatsapp, iconesPastorais } from "@/components/Icones";
import { LinkExterno } from "@/components/LinkExterno";
import { CabecalhoPagina, botao } from "@/components/Ui";
import { getPastoral, getPastorais } from "@/lib/data";
import { linkWhatsapp, urlSegura } from "@/lib/format";

export async function generateStaticParams() {
  return (await getPastorais()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pastorais/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPastoral(slug);
  return p ? { title: p.nome, description: p.resumo } : {};
}

// O slug (dado da URL) é lido dentro de um <Suspense>: assim o "esqueleto" da página
// é igual para todas as pastorais e a navegação continua instantânea.
export default function PastoralPage({ params }: PageProps<"/pastorais/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
      <DetalhePastoral params={params} />
    </Suspense>
  );
}

async function DetalhePastoral({ params }: Pick<PageProps<"/pastorais/[slug]">, "params">) {
  const { slug } = await params;
  const p = await getPastoral(slug);
  if (!p) notFound();

  const Icone = iconesPastorais[p.icone];
  const whats = linkWhatsapp(p.whatsapp, p.mensagemWhatsapp);
  const formExterno = urlSegura(p.formularioExterno);

  return (
    <>
      <CabecalhoPagina sobretitulo="Pastorais e Serviços" titulo={p.nome} subtitulo={p.resumo} />

      <div className="mx-auto max-w-7xl px-6 pt-6 text-sm">
        <Link href="/pastorais" className="flex items-center gap-2 text-mariano-700 hover:text-mariano-900"><IconeSetaEsquerda className="size-4" /> Todas as pastorais</Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1fr_28rem]">
        <div>
          <span className="grid size-14 place-items-center rounded-full bg-mariano-900 text-ouro-300">
            <Icone className="size-7" />
          </span>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-tinta/80">
            {p.sobre.map((t) => <p key={t}>{t}</p>)}
          </div>

          <h2 className="mt-10 font-serif text-2xl font-bold text-mariano-950">Como participar</h2>
          <ul className="mt-4 space-y-2">
            {p.requisitos.map((r) => (
              <li key={r} className="flex gap-2.5 text-tinta/80">
                <IconeCheck className="mt-0.5 size-5 shrink-0 text-ouro-500" /> {r}
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-center gap-2 rounded-xl bg-mariano-50 px-4 py-3 text-sm text-mariano-900">
            <IconeCalendario className="size-5 shrink-0" /> {p.encontros}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {whats && (
              <LinkExterno href={whats} className={botao.whatsapp}>
                <IconeWhatsapp className="size-5" /> Falar no WhatsApp
              </LinkExterno>
            )}
            {formExterno && (
              <LinkExterno href={formExterno} className={botao.contorno}>
                Formulário de inscrição <IconeExterno className="size-4" />
              </LinkExterno>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <FormularioInscricao setor={p.slug} titulo={`Inscrição - ${p.nome}`} />
        </aside>
      </section>
    </>
  );
}
