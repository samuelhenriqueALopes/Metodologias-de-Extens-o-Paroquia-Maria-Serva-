"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseSessao } from "@/lib/auth";

export type LoginState = { erro?: string; email?: string };

const schema = z.object({
  email: z.email().max(160),
  senha: z.string().min(8).max(128),
});

// Freio contra força bruta por IP (complementa os limites do próprio Supabase).
// Em memória: vale por instância do servidor.
const MAX_FALHAS = 5;
const JANELA_MS = 15 * 60_000;
const falhas = new Map<string, { qtd: number; desde: number }>();

function bloqueado(ip: string) {
  const f = falhas.get(ip);
  if (!f || Date.now() - f.desde > JANELA_MS) return false;
  return f.qtd >= MAX_FALHAS;
}

function registrarFalha(ip: string) {
  const f = falhas.get(ip);
  if (!f || Date.now() - f.desde > JANELA_MS) falhas.set(ip, { qtd: 1, desde: Date.now() });
  else f.qtd++;
}

const ERRO_GENERICO = "E-mail ou senha incorretos.";

export async function entrar(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 160);
  const senha = String(formData.get("senha") ?? "");

  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";

  if (bloqueado(ip)) {
    return { erro: "Muitas tentativas. Aguarde 15 minutos e tente novamente.", email };
  }

  const parsed = schema.safeParse({ email, senha });
  if (!parsed.success) {
    registrarFalha(ip);
    return { erro: ERRO_GENERICO, email };
  }

  const supabase = await getSupabaseSessao();
  if (!supabase) return { erro: "Supabase não configurado no servidor.", email };

  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.senha });
  if (error) {
    registrarFalha(ip);
    // Mesma mensagem para e-mail inexistente e senha errada (não revela contas).
    return { erro: ERRO_GENERICO, email };
  }

  const { data: ehAdmin } = await supabase.rpc("is_admin");
  if (ehAdmin !== true) {
    await supabase.auth.signOut();
    registrarFalha(ip);
    return { erro: "Este usuário não tem acesso ao painel.", email };
  }

  falhas.delete(ip);
  redirect("/admin");
}

export async function sair() {
  const supabase = await getSupabaseSessao();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
