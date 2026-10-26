import type { Metadata } from "next";
import Link from "next/link";
import { excluirHorario } from "@/app/admin/actions";
import { BotaoExcluir } from "@/components/admin/Comuns";
import { estilo } from "@/components/admin/estilo";
import { FormHorario } from "@/components/admin/Formularios";
import { MensagemOk, Tela, TituloPainel, Vazio } from "@/components/admin/Layout";
import { exigirAdmin } from "@/lib/auth";
import { DIAS_SEMANA, formatarHora } from "@/lib/format";

export const metadata: Metadata = { title: "Horários de missa" };

type Linha = {
  id: string; dia_semana: number; hora: string; tipo: string; local: string | null; observacao: string | null; ativo: boolean;
};

async function Conteudo({ searchParams }: { searchParams: PageProps<"/admin/horarios">["searchParams"] }) {
  const { supabase } = await exigirAdmin();
  const { editar, ok } = await searchParams;

  const { data, error } = await supabase
    .from("horarios_missa")
    .select("id, dia_semana, hora, tipo, local, observacao, ativo")
    .order("dia_semana")
    .order("hora");
  if (error) console.error("Painel: erro ao listar horários:", error.message);
  const horarios = (data ?? []) as Linha[];
  const emEdicao = typeof editar === "string" ? horarios.find((h) => h.id === editar) : undefined;

  return (
    <>
      <MensagemOk ok={ok} />
      <FormHorario
        key={emEdicao?.id ?? "novo"}
        horario={emEdicao && {
          ...emEdicao,
          hora: emEdicao.hora.slice(0, 5),
          local: emEdicao.local ?? "",
          observacao: emEdicao.observacao ?? "",
        }}
      />

      <section className={estilo.cartao}>
        <h2 className="border-b border-slate-200 px-5 py-3 font-semibold text-slate-900">Horários cadastrados</h2>
        {horarios.length === 0 ? <Vazio texto="Nenhum horário cadastrado." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Dia</th>
                  <th className="px-3 py-2 font-medium">Hora</th>
                  <th className="px-3 py-2 font-medium">Celebração</th>
                  <th className="px-3 py-2 font-medium">Situação</th>
                  <th className="px-5 py-2"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {horarios.map((h) => (
                  <tr key={h.id} className={h.ativo ? "" : "text-slate-400"}>
                    <td className="px-5 py-3 font-medium">{DIAS_SEMANA[h.dia_semana]}</td>
                    <td className="px-3 py-3">{formatarHora(h.hora)}</td>
                    <td className="px-3 py-3">
                      {h.tipo}
                      {(h.local || h.observacao) && (
                        <span className="block text-xs text-slate-500">{[h.local, h.observacao].filter(Boolean).join(" · ")}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${h.ativo ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                        {h.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/horarios?editar=${h.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-mariano-700 hover:bg-mariano-50">Editar</Link>
                        <BotaoExcluir acao={excluirHorario} id={h.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default function HorariosAdminPage(props: PageProps<"/admin/horarios">) {
  return (
    <>
      <TituloPainel titulo="Horários de missa" descricao="Grade semanal exibida no site. Desative um horário em vez de excluí-lo se for temporário." />
      <Tela><Conteudo searchParams={props.searchParams} /></Tela>
    </>
  );
}
