import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/server";
import { exemploAvisos, exemploEventos, exemploHorarios } from "@/content/exemplos";
import type { Aviso, Evento, HorarioMissa } from "@/lib/types";

// Dados ficam em cache por alguns minutos: alterações feitas no painel do
// Supabase aparecem no site sem precisar de novo deploy.
// Sem Supabase configurado, o site usa dados de exemplo para não ficar vazio.

export async function getHorarios(): Promise<HorarioMissa[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("horarios");

  const supabase = getPublicClient();
  if (!supabase) return exemploHorarios;

  const { data, error } = await supabase
    .from("horarios_missa")
    .select("id, dia_semana, hora, tipo, local, observacao")
    .order("dia_semana")
    .order("hora");

  if (error) {
    console.error("Erro ao buscar horários:", error.message);
    return [];
  }
  return data;
}

export async function getAvisos(limite = 20): Promise<Aviso[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("avisos");

  const supabase = getPublicClient();
  if (!supabase) return exemploAvisos.slice(0, limite);

  const { data, error } = await supabase
    .from("avisos")
    .select("id, titulo, conteudo, destaque, data_publicacao")
    .order("destaque", { ascending: false })
    .order("data_publicacao", { ascending: false })
    .limit(limite);

  if (error) {
    console.error("Erro ao buscar avisos:", error.message);
    return [];
  }
  return data;
}

export async function getProximosEventos(limite = 20): Promise<Evento[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("eventos");

  const supabase = getPublicClient();
  if (!supabase) return exemploEventos.slice(0, limite);

  const inicioDeHoje = new Date();
  inicioDeHoje.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("eventos")
    .select("id, titulo, descricao, data_inicio, data_fim, local, link_inscricao")
    .gte("data_inicio", inicioDeHoje.toISOString())
    .order("data_inicio")
    .limit(limite);

  if (error) {
    console.error("Erro ao buscar eventos:", error.message);
    return [];
  }
  return data;
}
