export type HorarioMissa = {
  id: string;
  dia_semana: number;
  hora: string;
  tipo: string;
  local: string | null;
  observacao: string | null;
};

export type Aviso = {
  id: string;
  titulo: string;
  conteudo: string;
  destaque: boolean;
  data_publicacao: string;
};

export type Evento = {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  local: string | null;
  link_inscricao: string | null;
};

export type IconeNome = "aliancas" | "vela" | "calice" | "maos";

export type Site = {
  nome: string;
  nomeCurto: string;
  lema: string;
  lemaReferencia: string;
  /** Frase do rodapé (ex.: "Ad Jesum per Mariam"). Vazia = não exibe. */
  divisa: string;
  arquidiocese: string;
  url: string;
  endereco: { logradouro: string; bairro: string; cidade: string; cep: string };
  mapsUrl: string;
  telefone: string;
  email: string;
  /** Somente dígitos, com DDI 55 + DDD. */
  whatsappSecretaria: string;
  mensagemWhatsapp: string;
  secretariaHorario: string;
  /** Vazio = o ícone não aparece. */
  redes: { instagram: string; facebook: string; youtube: string };
  dizimo: { chavePix: string; favorecido: string };
};

export type ItemMenu = { href: string; label: string };

export type Pastoral = {
  slug: string;
  nome: string;
  resumo: string;
  icone: IconeNome;
  sobre: string[];
  requisitos: string[];
  encontros: string;
  /** Somente dígitos, com DDI 55 + DDD. */
  whatsapp: string;
  mensagemWhatsapp: string;
  /** Formulário externo opcional (Google Forms etc.). Deve começar com https:// */
  formularioExterno?: string;
};

export type MarcoHistoria = { ano: string; texto: string };
