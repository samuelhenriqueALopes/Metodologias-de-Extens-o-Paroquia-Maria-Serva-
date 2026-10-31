import type { Aviso, Evento, HorarioMissa, MarcoHistoria } from "@/lib/types";

// Exibidos apenas enquanto o Supabase não estiver configurado (.env.local).

export const exemploHorarios: HorarioMissa[] = [
  { id: "h1", dia_semana: 0, hora: "07:30", tipo: "Missa", local: null, observacao: null },
  { id: "h2", dia_semana: 0, hora: "09:30", tipo: "Missa", local: null, observacao: null },
  { id: "h3", dia_semana: 0, hora: "19:00", tipo: "Missa", local: null, observacao: null },
  { id: "h4", dia_semana: 2, hora: "19:00", tipo: "Missa", local: null, observacao: null },
  { id: "h5", dia_semana: 3, hora: "19:00", tipo: "Missa", local: null, observacao: null },
  { id: "h6", dia_semana: 4, hora: "19:00", tipo: "Missa", local: null, observacao: null },
  { id: "h7", dia_semana: 5, hora: "19:00", tipo: "Missa", local: null, observacao: null },
  { id: "h8", dia_semana: 6, hora: "18:00", tipo: "Missa", local: null, observacao: null },
];

export const exemploAvisos: Aviso[] = [
  {
    id: "a1",
    titulo: "Bem-vindo ao novo site da paróquia",
    conteudo: "Aqui você encontra horários de missa, avisos, eventos e como participar das pastorais.",
    destaque: true,
    data_publicacao: "2026-10-20T12:00:00-03:00",
  },
  {
    id: "a2",
    titulo: "Confissões às sextas-feiras",
    conteudo: "Atendimento de confissões toda sexta-feira, das 17h às 19h, na secretaria paroquial.",
    destaque: false,
    data_publicacao: "2026-10-18T12:00:00-03:00",
  },
];

export const exemploEventos: Evento[] = [
  {
    id: "e1",
    titulo: "Retiro de Advento",
    descricao: "Um dia de oração e preparação para o Natal, aberto a toda a comunidade.",
    data_inicio: "2026-11-29T08:00:00-03:00",
    data_fim: "2026-11-29T17:00:00-03:00",
    local: "Salão paroquial",
    link_inscricao: null,
  },
  {
    id: "e2",
    titulo: "Missa de Natal",
    descricao: "Celebração da Noite Santa com o coral paroquial.",
    data_inicio: "2026-12-24T20:00:00-03:00",
    data_fim: null,
    local: "Igreja Matriz",
    link_inscricao: null,
  },
];

export const linhaDoTempoPadrao: MarcoHistoria[] = [
  { ano: "Origens", texto: "A comunidade nasce da fé de famílias do bairro que se reuniam para rezar o terço e celebrar a missa." },
  { ano: "Criação", texto: "A comunidade é elevada a paróquia pela Arquidiocese, sob o título de Maria, Serva do Senhor." },
  { ano: "Hoje", texto: "Uma família de fé com pastorais, movimentos e serviços que anunciam o Evangelho e cuidam de quem mais precisa." },
];
