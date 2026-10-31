import type { Metadata } from "next";
import Link from "next/link";
import { estilo } from "@/components/admin/estilo";
import { Tela, TituloPainel } from "@/components/admin/Layout";
import { connection } from "next/server";
import { exigirAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Visão geral" };

async function Conteudo() {
  const { supabase } = await exigirAdmin();
  await connection(); // usa a data atual: sempre calcular na requisição
  const agora = new Date().toISOString();
  const contar = { count: "exact", head: true } as const;

  const [novas, avisos, eventos, horarios] = await Promise.all([
    supabase.from("inscricoes").select("id", contar).eq("status", "novo"),
    supabase.from("avisos").select("id", contar).eq("publicado", true).lte("data_publicacao", agora)
      .or(`expira_em.is.null,expira_em.gt.${agora}`),
    supabase.from("eventos").select("id", contar).eq("publicado", true).gte("data_inicio", agora),
    supabase.from("horarios_missa").select("id", contar).eq("ativo", true),
  ]);

  const cartoes = [
    { rotulo: "Inscrições novas", valor: novas.count, href: "/admin/inscricoes?status=novo", destaque: (novas.count ?? 0) > 0 },
    { rotulo: "Avisos no ar", valor: avisos.count, href: "/admin/avisos" },
    { rotulo: "Próximos eventos", valor: eventos.count, href: "/admin/eventos" },
    { rotulo: "Horários ativos", valor: horarios.count, href: "/admin/horarios" },
  ];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cartoes.map((c) => (
          <li key={c.rotulo}>
            <Link href={c.href} className={`${estilo.cartao} block p-5 transition hover:border-mariano-300 ${c.destaque ? "ring-2 ring-ouro-400" : ""}`}>
              <p className="text-sm text-slate-600">{c.rotulo}</p>
              <p className="mt-1 text-3xl font-bold text-mariano-950">{c.valor ?? "-"}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className={`${estilo.cartao} p-5`}>
        <h2 className="font-semibold text-slate-900">Atalhos</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/avisos" className={estilo.botaoPrimario}>Publicar aviso</Link>
          <Link href="/admin/eventos" className={estilo.botaoSecundario}>Cadastrar evento</Link>
          <Link href="/admin/horarios" className={estilo.botaoSecundario}>Ajustar horários</Link>
        </div>
      </section>
    </>
  );
}

export default function PainelPage() {
  return (
    <>
      <TituloPainel titulo="Visão geral" descricao="Bem-vindo ao painel da secretaria." />
      <Tela><Conteudo /></Tela>
    </>
  );
}
