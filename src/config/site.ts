// ============================================================
// VALORES PADRÃO (reserva).
// Os dados reais ficam no banco (Supabase > tabelas `configuracoes_site`
// e `menu_navegacao`) e podem ser alterados sem novo build.
// Estes valores só aparecem se o Supabase não estiver configurado
// ou a migração 0003 ainda não tiver sido executada.
// ============================================================

import type { ItemMenu, Site } from "@/lib/types";

/**
 * URL pública do site. Fica em variável de ambiente (NEXT_PUBLIC_SITE_URL)
 * porque é configuração de implantação, não de conteúdo.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const sitePadrao: Site = {
  nome: "Paróquia Maria Serva do Senhor",
  nomeCurto: "Maria Serva do Senhor",
  lema: "Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.",
  lemaReferencia: "Lc 1,38",
  divisa: "Ad Jesum per Mariam",
  url: siteUrl,
  arquidiocese: "Arquidiocese de Belo Horizonte",

  endereco: {
    logradouro: "R. dos Médicos, 1008",
    bairro: "Alípio de Melo",
    cidade: "Belo Horizonte - MG",
    cep: "30840-020",
  },
  mapsUrl: "Https://maps.app.goo.gl/Q5Zzd8mamujYA4Yu6?g_st=ic",

  telefone: "(31) 99962-5767",
  email: "contato@paroquiamariaserva.org.br",
  whatsappSecretaria: "5531999625767",
  mensagemWhatsapp: "Olá! Vim pelo site da paróquia.",
  secretariaHorario: "Segunda a sexta, 8h30 às 12h e 13h às 18h",

  redes: {
    instagram: "https://www.instagram.com/paroquiamariaserva/",
    facebook: "https://www.facebook.com/paroquiamariaservadosenhor",
    youtube: "https://www.youtube.com/channel/UClhWDxRQzFp7oJI2OnJpjrQ",
  },

  dizimo: {
    chavePix: "17.505.249/0245-06",
    favorecido: "Mitra Arquidiocesana de Belo Horizonte",
  },
};

export const navegacaoPadrao: ItemMenu[] = [
  { href: "/", label: "Início" },
  { href: "/missas", label: "Missas e Avisos" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/pastorais", label: "Pastorais" },
  { href: "/dizimo", label: "Dízimo" },
];
