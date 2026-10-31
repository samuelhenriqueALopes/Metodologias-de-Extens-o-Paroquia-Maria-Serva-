import type { Metadata } from "next";
import { GradeHorarios, ListaAvisos } from "@/components/Blocos";
import { CabecalhoPagina, TituloSecao } from "@/components/Ui";
import { getAvisos, getHorarios, getSite } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { title: "Missas e Avisos", description: `Horários de missa e avisos da ${site.nome}.` };
}

export default async function MissasPage() {
  const [horarios, avisos] = await Promise.all([getHorarios(), getAvisos()]);

  return (
    <>
      <CabecalhoPagina sobretitulo="Celebrações" titulo="Missas e Avisos" subtitulo="Venha celebrar conosco. Confira os horários e fique atento aos avisos da semana." />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <TituloSecao sobretitulo="Semana" titulo="Horários de Missa" />
        <div className="mt-8">
          <GradeHorarios horarios={horarios} />
        </div>
        <p className="mt-6 text-sm text-tinta/60">
          Em dias santos de guarda e festas, os horários podem mudar - confira os avisos abaixo.
        </p>
      </section>

      <section id="avisos" className="bg-mariano-50/70">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <TituloSecao sobretitulo="Comunicados" titulo="Avisos" />
          <div className="mt-8">
            <ListaAvisos avisos={avisos} />
          </div>
        </div>
      </section>
    </>
  );
}
