import type { Metadata } from "next";
import Image from "next/image";
import { IconeCoracao, IconeCruz, IconeEstrela, IconeLocal } from "@/components/Icones";
import { LinkExterno } from "@/components/LinkExterno";
import { CabecalhoPagina, TituloSecao, botao } from "@/components/Ui";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: "A história e a missão da Paróquia Maria Serva do Senhor.",
};

// TODO: substituir pelos fatos reais da história da paróquia (datas, fundadores, párocos).
const linhaDoTempo = [
  { ano: "Origens", texto: "A comunidade nasce da fé de famílias do bairro que se reuniam para rezar o terço e celebrar a missa." },
  { ano: "Criação", texto: "A comunidade é elevada a paróquia pela Arquidiocese, sob o título de Maria, Serva do Senhor." },
  { ano: "Hoje", texto: "Uma família de fé com pastorais, movimentos e serviços que anunciam o Evangelho e cuidam de quem mais precisa." },
];

const valores = [
  { Icone: IconeCruz, titulo: "Eucaristia", texto: "A missa é o centro da nossa vida comunitária." },
  { Icone: IconeEstrela, titulo: "Maria", texto: "Aprendemos com Nossa Senhora o “sim” generoso a Deus." },
  { Icone: IconeCoracao, titulo: "Caridade", texto: "Servir os irmãos, especialmente os mais pobres." },
];

export default function QuemSomosPage() {
  return (
    <>
      <CabecalhoPagina sobretitulo="Nossa história" titulo="Quem Somos" subtitulo="Uma comunidade que, como Maria, quer dizer “sim” a Deus todos os dias." />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <TituloSecao sobretitulo="Nossa padroeira" titulo="Maria, Serva do Senhor" />
          <div className="mt-6 space-y-4 text-tinta/80">
            <p>
              Quando o anjo Gabriel anunciou que ela seria a Mãe do Salvador, Maria respondeu: <em>“Eis aqui a serva do
              Senhor; faça-se em mim segundo a tua palavra”</em> (Lc 1,38). Nessa resposta humilde e confiante está todo o
              espírito da nossa paróquia.
            </p>
            <p>
              Ser servo do Senhor é colocar a vida à disposição de Deus e dos irmãos. Por isso nossa comunidade se organiza
              em torno da oração, da Eucaristia e do serviço, para que cada pessoa encontre aqui um lugar de acolhida e de
              encontro com Cristo.
            </p>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl ring-1 ring-mariano-100">
          <Image src="/images/altar.webp" alt="Altar da igreja com o crucifixo e tecidos roxos do tempo da Quaresma" fill
            sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-mariano-50/70">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <TituloSecao sobretitulo="Caminhada" titulo="Nossa história" centro />
          <ol className="relative mt-10 space-y-8 border-l-2 border-ouro-300 pl-8">
            {linhaDoTempo.map((item) => (
              <li key={item.ano} className="relative">
                <span className="absolute -left-[2.6rem] top-1 grid size-5 place-items-center rounded-full bg-ouro-400 ring-4 ring-mariano-50" />
                <p className="text-xs font-semibold uppercase tracking-widest text-mariano-600">{item.ano}</p>
                <p className="mt-1 text-tinta/80">{item.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <TituloSecao sobretitulo="O que nos move" titulo="Nossos pilares" centro />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {valores.map(({ Icone, titulo, texto }) => (
            <li key={titulo} className="rounded-2xl border border-mariano-100 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-mariano-900 text-ouro-300">
                <Icone className="size-6" />
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold text-mariano-950">{titulo}</h3>
              <p className="mt-2 text-sm text-tinta/70">{texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-mariano-900 p-8 text-white sm:flex-row sm:p-10">
          <div className="flex items-start gap-4">
            <IconeLocal className="mt-1 size-6 shrink-0 text-ouro-300" />
            <div>
              <p className="font-serif text-2xl font-bold">Venha nos visitar</p>
              <p className="mt-1 text-mariano-100">
                {site.endereco.logradouro}, {site.endereco.bairro} · {site.endereco.cidade}
              </p>
            </div>
          </div>
          <LinkExterno href={site.mapsUrl} className={botao.ouro}>Como chegar</LinkExterno>
        </div>
      </section>
    </>
  );
}
