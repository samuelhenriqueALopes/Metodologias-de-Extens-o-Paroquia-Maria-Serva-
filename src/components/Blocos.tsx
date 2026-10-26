import { DIAS_SEMANA, formatarData, formatarHora, partesData, urlSegura } from "@/lib/format";
import type { Aviso, Evento, HorarioMissa } from "@/lib/types";
import { IconeExterno, IconeLocal, IconeMegafone, IconeRelogio } from "./Icones";
import { LinkExterno } from "./LinkExterno";

// Ordem de exibição: segunda → domingo
const ORDEM = [1, 2, 3, 4, 5, 6, 0];

export function GradeHorarios({ horarios }: { horarios: HorarioMissa[] }) {
  const porDia = ORDEM.map((dia) => ({ dia, itens: horarios.filter((h) => h.dia_semana === dia) })).filter((d) => d.itens.length);

  if (!porDia.length) {
    return <p className="text-center text-tinta/60">Horários em atualização. Consulte a secretaria.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {porDia.map(({ dia, itens }) => (
        <li key={dia} className={`rounded-2xl border bg-white p-5 shadow-sm ${dia === 0 ? "border-ouro-400 ring-1 ring-ouro-300" : "border-mariano-100"}`}>
          <p className="font-serif text-xl font-bold text-mariano-950">{DIAS_SEMANA[dia]}</p>
          <ul className="mt-3 space-y-2">
            {itens.map((h) => (
              <li key={h.id} className="flex items-baseline gap-3">
                <span className="inline-flex min-w-16 items-center gap-1 rounded-md bg-mariano-50 px-2 py-1 text-sm font-bold text-mariano-800">
                  <IconeRelogio className="size-3.5" /> {formatarHora(h.hora)}
                </span>
                <span className="text-sm">
                  {h.tipo}
                  {h.local && <span className="text-tinta/60"> · {h.local}</span>}
                  {h.observacao && <span className="block text-xs text-tinta/60">{h.observacao}</span>}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function ListaAvisos({ avisos }: { avisos: Aviso[] }) {
  if (!avisos.length) return <p className="text-tinta/60">Nenhum aviso no momento.</p>;

  return (
    <ul className="space-y-4">
      {avisos.map((a) => (
        <li key={a.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${a.destaque ? "border-l-4 border-l-ouro-400 border-y-mariano-100 border-r-mariano-100" : "border-mariano-100"}`}>
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mariano-50 text-mariano-700">
              <IconeMegafone className="size-4.5" />
            </span>
            <div>
              <p className="text-xs text-tinta/50">{formatarData(a.data_publicacao)}</p>
              <h3 className="font-semibold text-mariano-950">{a.titulo}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-tinta/75">{a.conteudo}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartaoEvento({ evento }: { evento: Evento }) {
  const d = partesData(evento.data_inicio);
  const link = urlSegura(evento.link_inscricao);

  return (
    <article className="flex gap-4 rounded-2xl border border-mariano-100 bg-white p-5 shadow-sm">
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-mariano-900 py-2 text-white">
        <span className="font-serif text-3xl font-bold leading-none">{d.dia}</span>
        <span className="text-xs uppercase tracking-wider text-ouro-300">{d.mes}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-mariano-950">{evento.titulo}</h3>
        <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-tinta/60">
          <span className="capitalize">{d.semana}, {d.hora}</span>
          {evento.local && (
            <span className="inline-flex items-center gap-1"><IconeLocal className="size-3" /> {evento.local}</span>
          )}
        </p>
        {evento.descricao && <p className="mt-2 text-sm text-tinta/75">{evento.descricao}</p>}
        {link && (
          <LinkExterno href={link} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mariano-700 hover:text-mariano-900">
            Inscrever-se <IconeExterno className="size-3.5" />
          </LinkExterno>
        )}
      </div>
    </article>
  );
}
