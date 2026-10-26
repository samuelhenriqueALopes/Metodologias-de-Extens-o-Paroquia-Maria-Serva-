"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { exigirAdmin } from "@/lib/auth";
import { deInputLocal } from "@/lib/format";

// Todas as ações: (1) exigem admin de novo — nunca confiam na tela;
// (2) validam no servidor; (3) gravam com a sessão do usuário, sujeitas ao RLS;
// (4) atualizam o cache do site público na hora.

export type EstadoForm = { erro?: string; campos?: Record<string, string[] | undefined> };

const id = z.uuid();
const textoOpcional = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === "" ? null : v));
const dataHora = (obrigatoria: boolean) =>
  z.string().transform((v, ctx) => {
    if (v === "" && !obrigatoria) return null;
    const iso = deInputLocal(v);
    if (!iso) ctx.addIssue({ code: "custom", message: "Data/hora inválida." });
    return iso;
  });

function ler(fd: FormData, ...campos: string[]) {
  return Object.fromEntries(campos.map((c) => [c, typeof fd.get(c) === "string" ? (fd.get(c) as string) : ""]));
}

function falhaValidacao(error: z.ZodError): EstadoForm {
  return { erro: "Confira os campos destacados.", campos: z.flattenError(error).fieldErrors };
}

function falhaBanco(contexto: string, mensagem: string): EstadoForm {
  console.error(`Painel: erro ao ${contexto}:`, mensagem);
  return { erro: "Não foi possível salvar. Tente novamente." };
}

// ---------------------------------------------------------------- Avisos

const schemaAviso = z.object({
  titulo: z.string().trim().min(3, { error: "Mínimo 3 caracteres." }).max(140),
  conteudo: z.string().trim().min(1, { error: "Escreva o aviso." }).max(2000),
  data_publicacao: dataHora(false),
  expira_em: dataHora(false),
});

export async function salvarAviso(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const { supabase } = await exigirAdmin();
  const parsed = schemaAviso.safeParse(ler(fd, "titulo", "conteudo", "data_publicacao", "expira_em"));
  if (!parsed.success) return falhaValidacao(parsed.error);

  const dados = {
    ...parsed.data,
    data_publicacao: parsed.data.data_publicacao ?? new Date().toISOString(),
    destaque: fd.get("destaque") === "on",
    publicado: fd.get("publicado") === "on",
  };
  if (dados.expira_em && dados.expira_em <= dados.data_publicacao) {
    return { erro: "A expiração precisa ser depois da publicação.", campos: { expira_em: ["Data anterior à publicação."] } };
  }

  const editarId = id.safeParse(fd.get("id"));
  const { error } = editarId.success
    ? await supabase.from("avisos").update(dados).eq("id", editarId.data)
    : await supabase.from("avisos").insert(dados);
  if (error) return falhaBanco("salvar aviso", error.message);

  updateTag("avisos");
  redirect("/admin/avisos?ok=salvo");
}

export async function excluirAviso(fd: FormData) {
  const { supabase } = await exigirAdmin();
  const alvo = id.safeParse(fd.get("id"));
  if (!alvo.success) return;
  const { error } = await supabase.from("avisos").delete().eq("id", alvo.data);
  if (error) console.error("Painel: erro ao excluir aviso:", error.message);
  updateTag("avisos");
  redirect("/admin/avisos?ok=excluido");
}

// ---------------------------------------------------------------- Horários

const schemaHorario = z.object({
  dia_semana: z.coerce.number().int().min(0).max(6),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { error: "Hora inválida." }),
  tipo: z.string().trim().min(1, { error: "Informe o tipo." }).max(60),
  local: textoOpcional(120),
  observacao: textoOpcional(200),
});

export async function salvarHorario(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const { supabase } = await exigirAdmin();
  const parsed = schemaHorario.safeParse(ler(fd, "dia_semana", "hora", "tipo", "local", "observacao"));
  if (!parsed.success) return falhaValidacao(parsed.error);

  const dados = { ...parsed.data, ativo: fd.get("ativo") === "on" };
  const editarId = id.safeParse(fd.get("id"));
  const { error } = editarId.success
    ? await supabase.from("horarios_missa").update(dados).eq("id", editarId.data)
    : await supabase.from("horarios_missa").insert(dados);
  if (error) return falhaBanco("salvar horário", error.message);

  updateTag("horarios");
  redirect("/admin/horarios?ok=salvo");
}

export async function excluirHorario(fd: FormData) {
  const { supabase } = await exigirAdmin();
  const alvo = id.safeParse(fd.get("id"));
  if (!alvo.success) return;
  const { error } = await supabase.from("horarios_missa").delete().eq("id", alvo.data);
  if (error) console.error("Painel: erro ao excluir horário:", error.message);
  updateTag("horarios");
  redirect("/admin/horarios?ok=excluido");
}

// ---------------------------------------------------------------- Eventos

const schemaEvento = z.object({
  titulo: z.string().trim().min(3, { error: "Mínimo 3 caracteres." }).max(140),
  descricao: textoOpcional(3000),
  data_inicio: dataHora(true),
  data_fim: dataHora(false),
  local: textoOpcional(160),
  link_inscricao: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https:\/\/[^\s]+$/i.test(v), { error: "O link precisa começar com https://" })
    .transform((v) => (v === "" ? null : v)),
});

export async function salvarEvento(_prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const { supabase } = await exigirAdmin();
  const parsed = schemaEvento.safeParse(ler(fd, "titulo", "descricao", "data_inicio", "data_fim", "local", "link_inscricao"));
  if (!parsed.success) return falhaValidacao(parsed.error);
  if (parsed.data.data_fim && parsed.data.data_inicio && parsed.data.data_fim < parsed.data.data_inicio) {
    return { erro: "O término precisa ser depois do início.", campos: { data_fim: ["Antes do início."] } };
  }

  const dados = { ...parsed.data, publicado: fd.get("publicado") === "on" };
  const editarId = id.safeParse(fd.get("id"));
  const { error } = editarId.success
    ? await supabase.from("eventos").update(dados).eq("id", editarId.data)
    : await supabase.from("eventos").insert(dados);
  if (error) return falhaBanco("salvar evento", error.message);

  updateTag("eventos");
  redirect("/admin/eventos?ok=salvo");
}

export async function excluirEvento(fd: FormData) {
  const { supabase } = await exigirAdmin();
  const alvo = id.safeParse(fd.get("id"));
  if (!alvo.success) return;
  const { error } = await supabase.from("eventos").delete().eq("id", alvo.data);
  if (error) console.error("Painel: erro ao excluir evento:", error.message);
  updateTag("eventos");
  redirect("/admin/eventos?ok=excluido");
}

// ---------------------------------------------------------------- Inscrições

const STATUS = ["novo", "em_contato", "concluido"] as const;

export async function alterarStatusInscricao(fd: FormData) {
  const { supabase } = await exigirAdmin();
  const alvo = id.safeParse(fd.get("id"));
  const status = z.enum(STATUS).safeParse(fd.get("status"));
  if (!alvo.success || !status.success) return;
  const { error } = await supabase.from("inscricoes").update({ status: status.data }).eq("id", alvo.data);
  if (error) console.error("Painel: erro ao alterar status:", error.message);
  const volta = z.string().regex(/^\?[\w=&%-]*$/).safeParse(fd.get("filtros"));
  redirect(`/admin/inscricoes${volta.success ? volta.data : ""}`);
}

export async function excluirInscricao(fd: FormData) {
  const { supabase } = await exigirAdmin();
  const alvo = id.safeParse(fd.get("id"));
  if (!alvo.success) return;
  const { error } = await supabase.from("inscricoes").delete().eq("id", alvo.data);
  if (error) console.error("Painel: erro ao excluir inscrição:", error.message);
  redirect("/admin/inscricoes?ok=excluido");
}
