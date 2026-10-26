import type { Metadata } from "next";
import { excluirInscricao } from "@/app/admin/actions";
import { BotaoExcluir } from "@/components/admin/Comuns";
import { estilo } from "@/components/admin/estilo";
import { MensagemOk, Tela, TituloPainel, Vazio } from "@/components/admin/Layout";
import { ROTULOS_STATUS, SeletorStatus } from "@/components/admin/SeletorStatus";
import { IconeWhatsapp } from "@/components/Icones";
import { pastorais, SETORES_FORMULARIO } from "@/content/pastorais";
import { exigirAdmin } from "@/lib/auth";
import { formatarData, linkWhatsapp } from "@/lib/format";

export const metadata: Metadata = { title: "Inscrições" };

const NOMES_SETOR: Record<string, string> = {
  ...Object.fromEntries(pastorais.map((p) => [p.slug, p.nome])),
  dizimo: "Dízimo",
};

type Linha = {
  id: string; setor: string; nome: string; telefone: string; email: string | null;
  mensagem: string | null; status: keyof typeof ROTULOS_STATUS; created_at: string;
};

function whatsDoInscrito(telefone: string, nome: string) {
  const numero = telefone.length <= 11 ? `55${telefone}` : telefone;
  return linkWhatsapp(numero, `Olá, ${nome.split(" ")[0]}! Aqui é da Paróquia Maria Serva do Senhor, sobre o seu contato pelo site.`);
}

async function Conteudo({ searchParams }: { searchParams: PageProps<"/admin/inscricoes">["searchParams"] }) {
  const { supabase } = await exigirAdmin();
  const sp = await searchParams;

  // Só aceita filtros conhecidos (nada do usuário vai cru para a consulta).
  const setor = SETORES_FORMULARIO.find((s) => s === sp.setor);
  const status = (Object.keys(ROTULOS_STATUS) as Linha["status"][]).find((s) => s === sp.status);

  let consulta = supabase
    .from("inscricoes")
    .select("id, setor, nome, telefone, email, mensagem, status, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (setor) consulta = consulta.eq("setor", setor);
  if (status) consulta = consulta.eq("status", status);

  const { data, error } = await consulta;
  if (error) console.error("Painel: erro ao listar inscrições:", error.message);
  const inscricoes = (data ?? []) as Linha[];

  const params = new URLSearchParams();
  if (setor) params.set("setor", setor);
  if (status) params.set("status", status);
  const filtros = params.size ? `?${params}` : "";

  return (
    <>
      <MensagemOk ok={sp.ok} />

      <form className={`${estilo.cartao} flex flex-wrap items-end gap-3 p-4`}>
        <div>
          <label htmlFor="setor" className={estilo.rotulo}>Setor</label>
          <select id="setor" name="setor" defaultValue={setor ?? ""} className={estilo.campo}>
            <option value="">Todos</option>
            {SETORES_FORMULARIO.map((s) => <option key={s} value={s}>{NOMES_SETOR[s]}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={estilo.rotulo}>Status</label>
          <select id="status" name="status" defaultValue={status ?? ""} className={estilo.campo}>
            <option value="">Todos</option>
            {Object.entries(ROTULOS_STATUS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </select>
        </div>
        <button type="submit" className={estilo.botaoSecundario}>Filtrar</button>
        <p className="ml-auto text-sm text-slate-500">{inscricoes.length} resultado(s)</p>
      </form>

      <section className={estilo.cartao}>
        {inscricoes.length === 0 ? <Vazio texto="Nenhuma inscrição encontrada." /> : (
          <ul className="divide-y divide-slate-100">
            {inscricoes.map((i) => {
              const whats = whatsDoInscrito(i.telefone, i.nome);
              return (
                <li key={i.id} className="space-y-2 px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-900">{i.nome}</span>
                        <span className="rounded-full bg-mariano-50 px-2 py-0.5 text-xs font-medium text-mariano-800">{NOMES_SETOR[i.setor] ?? i.setor}</span>
                        {i.status === "novo" && <span className="rounded-full bg-ouro-300/60 px-2 py-0.5 text-xs font-semibold text-mariano-950">Novo</span>}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatarData(i.created_at, { dateStyle: "short", timeStyle: "short" })} · {i.telefone}
                        {i.email && <> · <a href={`mailto:${i.email}`} className="text-mariano-700 hover:underline">{i.email}</a></>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {whats && (
                        <a href={whats} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-[#1f8f4e] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#187540]">
                          <IconeWhatsapp className="size-3.5" /> WhatsApp
                        </a>
                      )}
                      <SeletorStatus id={i.id} status={i.status} filtros={filtros} />
                      <BotaoExcluir acao={excluirInscricao} id={i.id} pergunta="Excluir os dados desta pessoa? (use para pedidos de exclusão – LGPD)" />
                    </div>
                  </div>
                  {i.mensagem && <p className="whitespace-pre-line rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{i.mensagem}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

export default function InscricoesAdminPage(props: PageProps<"/admin/inscricoes">) {
  return (
    <>
      <TituloPainel titulo="Inscrições" descricao="Contatos enviados pelos formulários de pastorais e dízimo." />
      <Tela><Conteudo searchParams={props.searchParams} /></Tela>
    </>
  );
}
