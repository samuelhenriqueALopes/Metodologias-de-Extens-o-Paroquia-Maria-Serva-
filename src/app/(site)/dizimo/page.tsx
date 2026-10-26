import type { Metadata } from "next";
import Image from "next/image";
import { CopiarTexto } from "@/components/CopiarTexto";
import { FormularioInscricao } from "@/components/FormularioInscricao";
import { IconeCoracao, IconeCruz, IconeEstrela, IconeMaos } from "@/components/Icones";
import { TituloSecao } from "@/components/Ui";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Dízimo",
  description: "Entenda o sentido do dízimo e saiba como contribuir com a paróquia.",
};

const destinos = [
  { Icone: IconeCruz, titulo: "Dimensão religiosa", texto: "Manutenção do culto, da liturgia, da igreja e de tudo o que é necessário para celebrar bem." },
  { Icone: IconeEstrela, titulo: "Dimensão missionária", texto: "Evangelização, catequese, formação de agentes e apoio às missões da Igreja." },
  { Icone: IconeMaos, titulo: "Dimensão caritativa", texto: "Cuidado com os pobres, doentes e famílias em necessidade da nossa comunidade." },
];

export default function DizimoPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image src="/images/altar.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_30%]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-roxo-900/90 to-roxo-900/75" />
        <div className="mx-auto max-w-3xl px-6 py-20 text-center text-white sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ouro-300">Dízimo</p>
          <h1 className="mt-3 font-serif text-5xl font-bold sm:text-6xl">Um gesto de fé e gratidão</h1>
          <blockquote className="mx-auto mt-6 max-w-xl text-lg italic text-white/85">
            “Cada um dê conforme decidiu em seu coração, sem pesar nem constrangimento, pois Deus ama quem dá com alegria.”
            <footer className="mt-2 text-sm not-italic font-semibold text-ouro-300">2Cor 9,7</footer>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <TituloSecao sobretitulo="Por que contribuir" titulo="O que é o dízimo" />
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-tinta/80">
          <p>
            O dízimo não é uma taxa nem um pagamento: é a <strong>devolução</strong> a Deus de uma parte daquilo que Ele
            mesmo nos concede. É uma expressão concreta de fé, de gratidão e de pertença à comunidade.
          </p>
          <p>
            Cada dizimista contribui com um valor que decide livremente, de forma <strong>periódica</strong> e
            <strong> consciente</strong>, de acordo com suas possibilidades. Mais importante que o valor é a fidelidade e
            a alegria de partilhar.
          </p>
        </div>
      </section>

      <section className="bg-mariano-50/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <TituloSecao sobretitulo="Para onde vai" titulo="As três dimensões do dízimo" centro />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {destinos.map(({ Icone, titulo, texto }) => (
              <li key={titulo} className="rounded-2xl border border-mariano-100 bg-white p-6 shadow-sm">
                <span className="grid size-12 place-items-center rounded-full bg-roxo-700 text-ouro-300">
                  <Icone className="size-6" />
                </span>
                <h3 className="mt-4 font-serif text-2xl font-bold text-mariano-950">{titulo}</h3>
                <p className="mt-2 text-sm text-tinta/70">{texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <TituloSecao sobretitulo="Como contribuir" titulo="Faça sua devolução" />
          <ol className="mt-6 space-y-4 text-tinta/80">
            <li><strong>1. Cadastre-se como dizimista</strong> pelo formulário ou na secretaria paroquial.</li>
            <li><strong>2. Escolha a forma:</strong> envelope na missa, na secretaria ou por PIX/transferência.</li>
            <li><strong>3. Seja fiel:</strong> mantenha sua contribuição periódica, no valor que decidiu em seu coração.</li>
          </ol>

          <div className="mt-8 rounded-2xl bg-mariano-900 p-6 text-white shadow-lg">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ouro-300">
              <IconeCoracao className="size-4" /> Doações pelo PIX · chave CNPJ
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xl font-semibold">{site.dizimo.chavePix}</p>
              <CopiarTexto texto={site.dizimo.chavePix} rotulo="Copiar chave" />
            </div>
            <p className="mt-2 text-sm text-mariano-100">Favorecido: {site.dizimo.favorecido}</p>
            <p className="mt-4 border-t border-mariano-700 pt-4 text-xs text-mariano-200">
              Confira sempre o nome do favorecido antes de confirmar. A paróquia nunca pede depósitos por mensagens de
              números desconhecidos.
            </p>
          </div>
        </div>

        <div>
          <FormularioInscricao setor="dizimo" titulo="Quero ser dizimista" />
        </div>
      </section>
    </>
  );
}
