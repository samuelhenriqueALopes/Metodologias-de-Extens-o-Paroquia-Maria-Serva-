"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { SETORES_FORMULARIO } from "@/content/pastorais";
import { getServiceClient } from "@/lib/supabase/server";

export type InscricaoState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"nome" | "telefone" | "email" | "mensagem" | "consentimento", string[]>>;
  valores?: { nome: string; telefone: string; email: string; mensagem: string };
};

const MAX_ENVIOS = 5;
const JANELA_MINUTOS = 15;
const TEMPO_MINIMO_MS = 3000;

const schema = z.object({
  setor: z.enum(SETORES_FORMULARIO),
  nome: z
    .string()
    .trim()
    .min(2, { error: "Informe seu nome." })
    .max(120, { error: "Nome muito longo." })
    .regex(/^[\p{L}\p{M}' .-]+$/u, { error: "Use apenas letras no nome." }),
  telefone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,13}$/, { error: "Informe um telefone com DDD." })),
  email: z
    .union([z.literal(""), z.email({ error: "E-mail inválido." }).max(160)])
    .transform((v) => (v === "" ? null : v.toLowerCase())),
  mensagem: z
    .string()
    .trim()
    .max(1000, { error: "Mensagem muito longa (máx. 1000 caracteres)." })
    .transform((v) => (v === "" ? null : v)),
  consentimento: z.literal("on", { error: "É necessário autorizar o contato." }),
});

function texto(formData: FormData, campo: string) {
  const v = formData.get(campo);
  return typeof v === "string" ? v : "";
}

export async function enviarInscricao(_prev: InscricaoState, formData: FormData): Promise<InscricaoState> {
  // 1. Honeypot: campo invisível que só robôs preenchem. Fingimos sucesso.
  if (texto(formData, "website") !== "") {
    return { status: "success", message: "Recebemos seu contato. Em breve retornaremos!" };
  }

  // Devolvidos ao formulário em caso de erro (cortados no tamanho máximo).
  const valores = {
    nome: texto(formData, "nome").slice(0, 120),
    telefone: texto(formData, "telefone").slice(0, 20),
    email: texto(formData, "email").slice(0, 160),
    mensagem: texto(formData, "mensagem").slice(0, 1000),
  };

  // 2. Envio rápido demais = provável robô.
  const inicio = Number(texto(formData, "_t"));
  if (!inicio || Date.now() - inicio < TEMPO_MINIMO_MS) {
    return { status: "error", message: "Envio muito rápido. Aguarde alguns segundos e tente novamente.", valores };
  }

  // 3. Validação no servidor (a do navegador pode ser burlada).
  const parsed = schema.safeParse({
    ...valores,
    setor: texto(formData, "setor"),
    consentimento: texto(formData, "consentimento"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Confira os campos destacados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      valores,
    };
  }

  const supabase = getServiceClient();
  const sal = process.env.IP_HASH_SALT;
  if (!supabase || !sal) {
    return { status: "error", message: "Formulário temporariamente indisponível. Fale conosco pelo WhatsApp.", valores };
  }

  // 4. Limite de envios por IP — guardamos só o hash com sal (LGPD).
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  const ipHash = createHash("sha256").update(`${sal}:${ip}`).digest("hex");

  const desde = new Date(Date.now() - JANELA_MINUTOS * 60_000).toISOString();
  const { count, error: erroContagem } = await supabase
    .from("inscricoes")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", desde);

  if (erroContagem) {
    console.error("Erro ao verificar limite:", erroContagem.message);
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente mais tarde.", valores };
  }
  if ((count ?? 0) >= MAX_ENVIOS) {
    return { status: "error", message: "Muitos envios em pouco tempo. Tente novamente mais tarde.", valores };
  }

  const { setor, nome, telefone, email, mensagem } = parsed.data;
  const { error } = await supabase.from("inscricoes").insert({ setor, nome, telefone, email, mensagem, ip_hash: ipHash });

  if (error) {
    // Nunca devolvemos detalhes do banco ao visitante.
    console.error("Erro ao salvar inscrição:", error.message);
    return { status: "error", message: "Não foi possível enviar agora. Tente novamente mais tarde.", valores };
  }

  return { status: "success", message: "Recebemos seu contato! A equipe responsável retornará em breve." };
}
