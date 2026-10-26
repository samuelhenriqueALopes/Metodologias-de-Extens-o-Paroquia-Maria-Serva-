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
