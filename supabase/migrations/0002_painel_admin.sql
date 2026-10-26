-- =====================================================================
-- Painel administrativo (Supabase Auth)
--   * Só quem está na tabela "administradores" pode editar conteúdo e ver
--     inscrições. Ter uma conta no Auth NÃO basta.
--   * O painel usa a sessão do próprio usuário (chave anon + JWT), então
--     o RLS é aplicado em cada operação — sem service_role no painel.
--   * Desative "Allow new users to sign up" em Authentication → Sign In / Providers.
-- =====================================================================

create table public.administradores (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  nome       text check (char_length(nome) <= 120),
  created_at timestamptz not null default now()
);

alter table public.administradores enable row level security;
alter table public.administradores force row level security;
revoke all on public.administradores from anon, authenticated;

-- security definer: consulta a tabela sem precisar de policy de leitura nela.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------
-- Conteúdo: administradores leem tudo (inclusive rascunhos) e editam.
-- As policies de leitura pública da 0001 continuam valendo para visitantes.
-- ---------------------------------------------------------------------
grant select, insert, update, delete on public.horarios_missa, public.avisos, public.eventos to authenticated;

create policy "admin gerencia horarios" on public.horarios_missa
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admin gerencia avisos" on public.avisos
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admin gerencia eventos" on public.eventos
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Inscrições: admin lê, altera SOMENTE o status e pode excluir (LGPD).
-- ---------------------------------------------------------------------
grant select, delete on public.inscricoes to authenticated;
grant update (status) on public.inscricoes to authenticated;

create policy "admin le inscricoes" on public.inscricoes
  for select to authenticated using ((select public.is_admin()));

create policy "admin atualiza status" on public.inscricoes
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admin exclui inscricoes" on public.inscricoes
  for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Como cadastrar um administrador:
--   1. Authentication → Users → Add user (e-mail + senha forte, "Auto confirm").
--   2. Rode:  insert into public.administradores (user_id, nome)
--             select id, 'Secretaria' from auth.users where email = 'secretaria@exemplo.com';
-- ---------------------------------------------------------------------
