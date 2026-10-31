import Image from "next/image";
import Link from "next/link";
import { CartaoEvento, GradeHorarios, ListaAvisos } from "@/components/Blocos";
import { IconeEstrela, IconeSetaDireita, iconesPastorais } from "@/components/Icones";
import { TituloSecao, botao } from "@/components/Ui";
import { getAvisos, getHorarios, getPastorais, getProximosEventos, getSite } from "@/lib/data";

export default async function Home() {
  const [site, pastorais, horarios, avisos, eventos] = await Promise.all([
    getSite(), getPastorais(), getHorarios(), getAvisos(3), getProximosEventos(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mariano-400">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,255,255,0.28),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-6 pt-12 md:grid-cols-2 md:pt-0">
          <div className="py-4 text-center md:py-24 md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mariano-950/70">Bem-vindo à</p>
            <h1 className="mt-3 font-serif text-5xl font-bold leading-[1.05] text-white drop-shadow-sm sm:text-6xl">
              {site.nome}
            </h1>
            <blockquote className="mx-auto mt-6 max-w-md border-l-2 border-white/60 pl-4 text-left text-lg italic text-mariano-950/85 md:mx-0">
              “{site.lema}”
              <footer className="mt-1 text-sm not-italic font-semibold text-mariano-950/70">{site.lemaReferencia}</footer>
            </blockquote>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/missas" className={botao.primario}>Horários de Missa</Link>
              <Link href="/dizimo" className={botao.claro}>Seja dizimista</Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-878/579 w-full max-w-xl md:self-end">
            <Image
              src="/images/maria.png"
              alt="Ilustração de Nossa Senhora em oração, coroada de doze estrelas"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain object-bottom mask-[radial-gradient(ellipse_50%_60%_at_50%_45%,#000_65%,transparent_100%)]"
            />
          </div>
        </div>
      </section>

      {/* Horários */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <TituloSecao sobretitulo="Celebrações" titulo="Horários de Missa" />
          <Link href="/missas" className="inline-flex items-center gap-1 text-sm font-semibold text-mariano-700 hover:text-mariano-900">
            Ver todos os avisos <IconeSetaDireita className="size-4" />
          </Link>
        </div>
        <div className="mt-8">
          <GradeHorarios horarios={horarios} />
        </div>
      </section>

      {/* Avisos + Eventos */}
      <section className="bg-mariano-50/70">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <TituloSecao sobretitulo="Fique por dentro" titulo="Avisos" />
            <div className="mt-8">
              <ListaAvisos avisos={avisos} />
            </div>
          </div>
          <div>
            <TituloSecao sobretitulo="Agenda" titulo="Próximos eventos" />
            <div className="mt-8 space-y-4">
              {eventos.length ? eventos.map((e) => <CartaoEvento key={e.id} evento={e} />) : <p className="text-tinta/60">Nenhum evento agendado.</p>}
            </div>
            <Link href="/eventos" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-mariano-700 hover:text-mariano-900">
              Ver agenda completa <IconeSetaDireita className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pastorais */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <TituloSecao sobretitulo="Sirva na comunidade" titulo="Pastorais e Serviços" centro />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pastorais.map((p) => {
            const Icone = iconesPastorais[p.icone];
            return (
              <li key={p.slug}>
                <Link href={`/pastorais/${p.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-mariano-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-mariano-300 hover:shadow-md">
                  <span className="grid size-12 place-items-center rounded-full bg-mariano-900 text-ouro-300">
                    <Icone className="size-6" />
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-mariano-950">{p.nome}</h3>
                  <p className="mt-2 flex-1 text-sm text-tinta/70">{p.resumo}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mariano-700 group-hover:text-mariano-900">
                    Saiba mais <IconeSetaDireita className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Dízimo */}
      <section className="relative isolate overflow-hidden">
        <Image src="/images/altar.webp" alt="" fill sizes="100vw" className="-z-10 object-cover object-[50%_35%]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-roxo-900/95 via-roxo-900/80 to-roxo-700/40" />
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="max-w-xl text-white">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-ouro-300">
              <IconeEstrela className="size-3" /> Dízimo
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Gratidão que sustenta a missão</h2>
            <p className="mt-4 text-white/85">
              O dízimo é a resposta de fé de quem reconhece que tudo vem de Deus. Com ele, a paróquia mantém o culto,
              a evangelização e o cuidado com os mais pobres.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dizimo" className={botao.ouro}>Quero ser dizimista</Link>
              <Link href="/quem-somos" className={botao.claro}>Conheça a paróquia</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
