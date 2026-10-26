// ============================================================
// Informações gerais da paróquia — EDITE AQUI.
// Itens marcados com TODO são valores provisórios.
// ============================================================

export const site = {
  nome: "Paróquia Maria Serva do Senhor",
  nomeCurto: "Maria Serva do Senhor",
  lema: "Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.",
  lemaReferencia: "Lc 1,38",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  arquidiocese: "Arquidiocese de Belo Horizonte", // TODO: confirmar

  endereco: {
    logradouro: "Rua Exemplo, 123", // TODO
    bairro: "Bairro", // TODO
    cidade: "Belo Horizonte - MG", // TODO
    cep: "00000-000", // TODO
  },
  /** Link "Como chegar" (Google Maps). TODO */
  mapsUrl: "https://www.google.com/maps",

  telefone: "(31) 99962-5767",
  email: "contato@paroquiamariaserva.org.br", // TODO
  /** Somente dígitos, com DDI 55 + DDD. */
  whatsappSecretaria: "5531999625767",
  secretariaHorario: "Segunda a sexta, 8h30 às 12h e 13h às 18h",

  redes: {
    instagram: "https://www.instagram.com/paroquiamariaserva/",
    facebook: "https://www.facebook.com/paroquiamariaservadosenhor",
    youtube: "https://www.youtube.com/channel/UClhWDxRQzFp7oJI2OnJpjrQ",
  },

  dizimo: {
    /** CNPJ usado como chave PIX */
    chavePix: "17.505.249/0245-06",
    favorecido: "Mitra Arquidiocesana de Belo Horizonte",
  },
} as const;

export const navegacao = [
  { href: "/", label: "Início" },
  { href: "/missas", label: "Missas e Avisos" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/pastorais", label: "Pastorais" },
  { href: "/dizimo", label: "Dízimo" },
] as const;
