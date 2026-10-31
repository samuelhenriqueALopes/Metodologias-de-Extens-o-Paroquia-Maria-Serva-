import type { Metadata } from "next";
import { CartaoEvento } from "@/components/Blocos";
import { CabecalhoPagina } from "@/components/Ui";
import { formatarData } from "@/lib/format";
import { getProximosEventos, getSite } from "@/lib/data";
import type { Evento } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return { title: "Eventos", description: `Agenda de eventos da ${site.nome}.` };
}

function agruparPorMes(eventos: Evento[]) {
  const grupos = new Map<string, Evento[]>();
  for (const e of eventos) {
    const mes = formatarData(e.data_inicio, { month: "long", year: "numeric" });
    grupos.set(mes, [...(grupos.get(mes) ?? []), e]);
  }
  return [...grupos.entries()];
}

export default async function EventosPage() {
  const eventos = await getProximosEventos(50);
  const grupos = agruparPorMes(eventos);

  return (
    <>
      <CabecalhoPagina sobretitulo="Agenda" titulo="Próximos Eventos" subtitulo="Retiros, festas, formações e celebrações especiais da nossa comunidade." />

      <section className="mx-auto max-w-3xl px-6 py-16">
        {grupos.length === 0 && <p className="text-center text-tinta/60">Nenhum evento agendado no momento.</p>}
        <div className="space-y-12">
          {grupos.map(([mes, lista]) => (
            <div key={mes}>
              <h2 className="font-serif text-2xl font-bold capitalize text-mariano-950">{mes}</h2>
              <div className="mt-4 space-y-4">
                {lista.map((e) => <CartaoEvento key={e.id} evento={e} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
