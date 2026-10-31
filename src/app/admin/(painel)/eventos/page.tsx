import type { Metadata } from "next";
import Link from "next/link";
import { excluirEvento } from "@/app/admin/actions";
import { BotaoExcluir } from "@/components/admin/Comuns";
import { estilo } from "@/components/admin/estilo";
import { FormEvento } from "@/components/admin/Formularios";
import { MensagemOk, Tela, TituloPainel, Vazio } from "@/components/admin/Layout";
import { connection } from "next/server";
import { exigirAdmin } from "@/lib/auth";
import { formatarData, paraInputLocal } from "@/lib/format";

export const metadata: Metadata = { title: "Eventos" };

type Linha = {
  id: string; titulo: string; descricao: string | null; data_inicio: string; data_fim: string | null;
  local: string | null; link_inscricao: string | null; publicado: boolean;
};

async function Conteudo({ searchParams }: { searchParams: PageProps<"/admin/eventos">["searchParams"] }) {
  const { supabase } = await exigirAdmin();
  await connection(); // usa a data atual: sempre calcular na requisição
  const { editar, ok } = await searchParams;

  const { data, error } = await supabase
    .from("eventos")
    .select("id, titulo, descricao, data_inicio, data_fim, local, link_inscricao, publicado")
    .order("data_inicio", { ascending: false })
    .limit(200);
  if (error) console.error("Painel: erro ao listar eventos:", error.message);
  const eventos = (data ?? []) as Linha[];
  const emEdicao = typeof editar === "string" ? eventos.find((e) => e.id === editar) : undefined;
  const agora = new Date().toISOString();

  return (
    <>
      <MensagemOk ok={ok} />
      <FormEvento
        key={emEdicao?.id ?? "novo"}
        evento={emEdicao && {
          ...emEdicao,
          descricao: emEdicao.descricao ?? "",
          data_inicio: paraInputLocal(emEdicao.data_inicio),
          data_fim: paraInputLocal(emEdicao.data_fim),
          local: emEdicao.local ?? "",
          link_inscricao: emEdicao.link_inscricao ?? "",
        }}
      />

      <section className={estilo.cartao}>
        <h2 className="border-b border-slate-200 px-5 py-3 font-semibold text-slate-900">Eventos cadastrados</h2>
        {eventos.length === 0 ? <Vazio texto="Nenhum evento cadastrado." /> : (
          <ul className="divide-y divide-slate-100">
            {eventos.map((e) => {
              const passado = (e.data_fim ?? e.data_inicio) < agora;
              return (
                <li key={e.id} className={`flex flex-wrap items-start justify-between gap-3 px-5 py-4 ${passado ? "opacity-60" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-900">{e.titulo}</span>
                      {!e.publicado && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">Rascunho</span>}
                      {passado && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Encerrado</span>}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatarData(e.data_inicio, { dateStyle: "full", timeStyle: "short" })}
                      {e.local && ` - ${e.local}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/eventos?editar=${e.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-mariano-700 hover:bg-mariano-50">Editar</Link>
                    <BotaoExcluir acao={excluirEvento} id={e.id} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

export default function EventosAdminPage(props: PageProps<"/admin/eventos">) {
  return (
    <>
      <TituloPainel titulo="Eventos" descricao="Agenda da paróquia. Eventos passados saem automaticamente do site." />
      <Tela><Conteudo searchParams={props.searchParams} /></Tela>
    </>
  );
}
