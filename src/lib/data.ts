import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/server";
import { navegacaoPadrao, sitePadrao } from "@/config/site";
import { pastoraisPadrao } from "@/content/pastorais";
import { exemploAvisos, exemploEventos, exemploHorarios, linhaDoTempoPadrao } from "@/content/exemplos";
import type { Aviso, Evento, HorarioMissa, IconeNome, ItemMenu, MarcoHistoria, Pastoral, Site } from "@/lib/types";

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

// ---------------------------------------------------------------------------
// Configurações do site (editáveis no Supabase, sem novo build).
// Se o banco não estiver configurado, estiver vazio ou der erro, usamos os
// valores padrão do código - o site nunca fica sem cabeçalho/rodapé.
// ---------------------------------------------------------------------------

type LinhaSite = {
  nome: string; nome_curto: string; lema: string; lema_referencia: string; divisa: string | null;
  arquidiocese: string; logradouro: string; bairro: string; cidade: string; cep: string; maps_url: string | null;
  telefone: string; email: string; whatsapp_secretaria: string; mensagem_whatsapp: string; secretaria_horario: string;
  instagram_url: string | null; facebook_url: string | null; youtube_url: string | null;
  dizimo_chave_pix: string; dizimo_favorecido: string;
};

export async function getSite(): Promise<Site> {
  "use cache";
  cacheLife("minutes");
  cacheTag("site");

  const supabase = getPublicClient();
  if (!supabase) return sitePadrao;

  const { data, error } = await supabase
    .from("configuracoes_site")
    .select(
      "nome, nome_curto, lema, lema_referencia, divisa, arquidiocese, logradouro, bairro, cidade, cep, maps_url, telefone, email, whatsapp_secretaria, mensagem_whatsapp, secretaria_horario, instagram_url, facebook_url, youtube_url, dizimo_chave_pix, dizimo_favorecido",
    )
    .eq("id", 1)
    .maybeSingle<LinhaSite>();

  if (error) console.error("Erro ao buscar configurações do site:", error.message);
  if (!data) return sitePadrao;

  return {
    nome: data.nome,
    nomeCurto: data.nome_curto,
    lema: data.lema,
    lemaReferencia: data.lema_referencia,
    divisa: data.divisa ?? "",
    arquidiocese: data.arquidiocese,
    url: sitePadrao.url, // vem de NEXT_PUBLIC_SITE_URL (configuração de implantação)
    endereco: { logradouro: data.logradouro, bairro: data.bairro, cidade: data.cidade, cep: data.cep },
    mapsUrl: data.maps_url ?? "",
    telefone: data.telefone,
    email: data.email,
    whatsappSecretaria: data.whatsapp_secretaria,
    mensagemWhatsapp: data.mensagem_whatsapp,
    secretariaHorario: data.secretaria_horario,
    redes: { instagram: data.instagram_url ?? "", facebook: data.facebook_url ?? "", youtube: data.youtube_url ?? "" },
    dizimo: { chavePix: data.dizimo_chave_pix, favorecido: data.dizimo_favorecido },
  };
}

export async function getNavegacao(): Promise<ItemMenu[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("navegacao");

  const supabase = getPublicClient();
  if (!supabase) return navegacaoPadrao;

  const { data, error } = await supabase.from("menu_navegacao").select("href, label").order("ordem").order("label");
  if (error) {
    console.error("Erro ao buscar menu:", error.message);
    return navegacaoPadrao;
  }
  return data.length ? data : navegacaoPadrao;
}

type LinhaPastoral = {
  slug: string; nome: string; resumo: string; icone: IconeNome; sobre: string[]; requisitos: string[];
  encontros: string; whatsapp: string; mensagem_whatsapp: string; formulario_externo: string | null;
};

export async function getPastorais(): Promise<Pastoral[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("pastorais");

  const supabase = getPublicClient();
  if (!supabase) return pastoraisPadrao;

  const { data, error } = await supabase
    .from("pastorais")
    .select("slug, nome, resumo, icone, sobre, requisitos, encontros, whatsapp, mensagem_whatsapp, formulario_externo")
    .order("ordem")
    .order("nome")
    .returns<LinhaPastoral[]>();

  if (error) {
    console.error("Erro ao buscar pastorais:", error.message);
    return pastoraisPadrao;
  }
  return data.map((p) => ({
    slug: p.slug,
    nome: p.nome,
    resumo: p.resumo,
    icone: p.icone,
    sobre: p.sobre ?? [],
    requisitos: p.requisitos ?? [],
    encontros: p.encontros,
    whatsapp: p.whatsapp,
    mensagemWhatsapp: p.mensagem_whatsapp,
    formularioExterno: p.formulario_externo ?? undefined,
  }));
}

export async function getPastoral(slug: string): Promise<Pastoral | undefined> {
  return (await getPastorais()).find((p) => p.slug === slug);
}

/** Setores aceitos nos formulários: o dízimo + todas as pastorais ativas. */
export async function getSetoresFormulario(): Promise<string[]> {
  return [...(await getPastorais()).map((p) => p.slug), "dizimo"];
}

export async function getLinhaDoTempo(): Promise<MarcoHistoria[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("linha_do_tempo");

  const supabase = getPublicClient();
  if (!supabase) return linhaDoTempoPadrao;

  const { data, error } = await supabase.from("linha_do_tempo").select("ano, texto").order("ordem");
  if (error) {
    console.error("Erro ao buscar linha do tempo:", error.message);
    return linhaDoTempoPadrao;
  }
  return data;
}
