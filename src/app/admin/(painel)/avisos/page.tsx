import type { Metadata } from "next";
import Link from "next/link";
import { excluirAviso } from "@/app/admin/actions";
import { BotaoExcluir } from "@/components/admin/Comuns";
import { estilo } from "@/components/admin/estilo";
import { FormAviso } from "@/components/admin/Formularios";
import { MensagemOk, Tela, TituloPainel, Vazio } from "@/components/admin/Layout";
import { connection } from "next/server";
import { exigirAdmin } from "@/lib/auth";
import { formatarData, paraInputLocal } from "@/lib/format";

export const metadata: Metadata = { title: "Avisos" };

type Linha = {
  id: string; titulo: string; conteudo: string; destaque: boolean; publicado: boolean;
  data_publicacao: string; expira_em: string | null;
};

function situacao(a: Linha) {
  const agora = new Date().toISOString();
  if (!a.publicado) return { texto: "Rascunho", cor: "bg-slate-100 text-slate-700" };
  if (a.expira_em && a.expira_em <= agora) return { texto: "Expirado", cor: "bg-amber-100 text-amber-800" };
  if (a.data_publicacao > agora) return { texto: "Agendado", cor: "bg-sky-100 text-sky-800" };
  return { texto: "No ar", cor: "bg-emerald-100 text-emerald-800" };
}

async function Conteudo({ searchParams }: { searchParams: PageProps<"/admin/avisos">["searchParams"] }) {
  const { supabase } = await exigirAdmin();
  await connection(); // usa a data atual: sempre calcular na requisição
  const { editar, ok } = await searchParams;

  const { data, error } = await supabase
    .from("avisos")
    .select("id, titulo, conteudo, destaque, publicado, data_publicacao, expira_em")
    .order("data_publicacao", { ascending: false })
    .limit(200);
  if (error) console.error("Painel: erro ao listar avisos:", error.message);
  const avisos = (data ?? []) as Linha[];
  const emEdicao = typeof editar === "string" ? avisos.find((a) => a.id === editar) : undefined;

  return (
    <>
      <MensagemOk ok={ok} />
      <FormAviso
        key={emEdicao?.id ?? "novo"}
        aviso={emEdicao && {
          ...emEdicao,
          data_publicacao: paraInputLocal(emEdicao.data_publicacao),
          expira_em: paraInputLocal(emEdicao.expira_em),
        }}
      />

      <section className={estilo.cartao}>
        <h2 className="border-b border-slate-200 px-5 py-3 font-semibold text-slate-900">Avisos cadastrados</h2>
        {avisos.length === 0 ? <Vazio texto="Nenhum aviso cadastrado." /> : (
          <ul className="divide-y divide-slate-100">
            {avisos.map((a) => {
              const s = situacao(a);
              return (
                <li key={a.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-900">{a.titulo}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.cor}`}>{s.texto}</span>
                      {a.destaque && <span className="rounded-full bg-ouro-300/50 px-2 py-0.5 text-xs font-medium text-ouro-600">Destaque</span>}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.conteudo}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Publicação: {formatarData(a.data_publicacao, { dateStyle: "short", timeStyle: "short" })}
                      {a.expira_em && ` · Expira: ${formatarData(a.expira_em, { dateStyle: "short", timeStyle: "short" })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/avisos?editar=${a.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-mariano-700 hover:bg-mariano-50">Editar</Link>
                    <BotaoExcluir acao={excluirAviso} id={a.id} />
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

export default function AvisosAdminPage(props: PageProps<"/admin/avisos">) {
  return (
    <>
      <TituloPainel titulo="Avisos" descricao="Comunicados exibidos na página inicial e em Missas e Avisos." />
      <Tela><Conteudo searchParams={props.searchParams} /></Tela>
    </>
  );
}
