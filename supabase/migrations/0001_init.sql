-- =====================================================================
-- Paróquia Maria Serva do Senhor - schema inicial
-- Princípios de segurança:
--   * RLS habilitado em TODAS as tabelas (negar por padrão).
--   * Visitantes anônimos só LEEM conteúdo publicado.
--   * Inscrições NÃO são acessíveis pela chave anon (nem leitura nem escrita);
--     só o servidor do Next.js grava, usando a service_role (nunca exposta ao navegador).
--   * Restrições CHECK limitam tamanho e formato dos dados mesmo se a
--     validação da aplicação for burlada.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Horários de missa
-- ---------------------------------------------------------------------
create table public.horarios_missa (
  id          uuid primary key default gen_random_uuid(),
  dia_semana  smallint not null check (dia_semana between 0 and 6), -- 0 = domingo
  hora        time not null,
  tipo        text not null default 'Missa' check (char_length(tipo) <= 60),
  local       text check (char_length(local) <= 120),
  observacao  text check (char_length(observacao) <= 200),
  ativo       boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Avisos (ex.: missa transferida, celebrações especiais)
-- ---------------------------------------------------------------------
create table public.avisos (
  id               uuid primary key default gen_random_uuid(),
  titulo           text not null check (char_length(titulo) between 3 and 140),
  conteudo         text not null check (char_length(conteudo) <= 2000),
  destaque         boolean not null default false,
  publicado        boolean not null default true,
  data_publicacao  timestamptz not null default now(),
  expira_em        timestamptz,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Eventos
-- ---------------------------------------------------------------------
create table public.eventos (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null check (char_length(titulo) between 3 and 140),
  descricao       text check (char_length(descricao) <= 3000),
  data_inicio     timestamptz not null,
  data_fim        timestamptz,
  local           text check (char_length(local) <= 160),
  link_inscricao  text check (link_inscricao is null or link_inscricao ~* '^https://'),
  publicado       boolean not null default true,
  created_at      timestamptz not null default now(),
  check (data_fim is null or data_fim >= data_inicio)
);

-- ---------------------------------------------------------------------
-- Inscrições / contatos vindos dos formulários do site
-- ---------------------------------------------------------------------
create table public.inscricoes (
  id          uuid primary key default gen_random_uuid(),
  setor       text not null check (setor in ('casamento','coroinhas','ministros','acolhida','dizimo')),
  nome        text not null check (char_length(nome) between 2 and 120),
  telefone    text not null check (telefone ~ '^[0-9]{10,13}$'),
  email       text check (email is null or (char_length(email) <= 160 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  mensagem    text check (char_length(mensagem) <= 1000),
  ip_hash     text not null check (char_length(ip_hash) = 64), -- SHA-256 com sal, nunca o IP puro (LGPD)
  status      text not null default 'novo' check (status in ('novo','em_contato','concluido')),
  created_at  timestamptz not null default now()
);

create index inscricoes_ip_hash_created_idx on public.inscricoes (ip_hash, created_at desc);
create index eventos_data_idx on public.eventos (data_inicio) where publicado;
create index avisos_publicacao_idx on public.avisos (data_publicacao desc) where publicado;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.horarios_missa enable row level security;
alter table public.avisos         enable row level security;
alter table public.eventos        enable row level security;
alter table public.inscricoes     enable row level security;

-- Força RLS até para o dono da tabela (defesa em profundidade).
alter table public.horarios_missa force row level security;
alter table public.avisos         force row level security;
alter table public.eventos        force row level security;
alter table public.inscricoes     force row level security;

-- Leitura pública apenas do que está publicado/ativo.
create policy "leitura publica de horarios ativos"
  on public.horarios_missa for select to anon, authenticated
  using (ativo);

create policy "leitura publica de avisos publicados"
  on public.avisos for select to anon, authenticated
  using (publicado and data_publicacao <= now() and (expira_em is null or expira_em > now()));

create policy "leitura publica de eventos publicados"
  on public.eventos for select to anon, authenticated
  using (publicado);

-- inscricoes: nenhuma policy para anon/authenticated => acesso negado.
-- A service_role ignora RLS e é usada somente no servidor.

-- Remove privilégios de escrita que o Supabase concede por padrão.
revoke insert, update, delete, truncate on public.horarios_missa from anon, authenticated;
revoke insert, update, delete, truncate on public.avisos         from anon, authenticated;
revoke insert, update, delete, truncate on public.eventos        from anon, authenticated;
revoke all on public.inscricoes from anon, authenticated;
