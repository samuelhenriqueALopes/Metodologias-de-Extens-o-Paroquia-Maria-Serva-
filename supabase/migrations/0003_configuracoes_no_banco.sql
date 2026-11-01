-- =====================================================================
-- Configurações editáveis no banco (sem novo deploy / build)
--   * configuracoes_site : dados gerais (nome, endereço, telefones, redes, PIX...)
--   * menu_navegacao     : links do menu do site
--   * pastorais          : pastorais e serviços (textos, WhatsApp, formulário)
--   * linha_do_tempo     : história da paróquia (página "Quem Somos")
--
-- Edite pelo Supabase > Table Editor. As mudanças aparecem no site em poucos
-- minutos (cache) - sem alterar código e sem rodar `npm run build`.
-- Mesmas regras de segurança das outras tabelas: RLS ligado, leitura pública
-- só do que está ativo, escrita só para administradores.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Dados gerais do site (sempre UMA linha: id = 1)
-- ---------------------------------------------------------------------
create table public.configuracoes_site (
  id                    smallint primary key default 1 check (id = 1),
  nome                  text not null check (char_length(nome) between 1 and 120),
  nome_curto            text not null check (char_length(nome_curto) between 1 and 80),
  lema                  text not null check (char_length(lema) <= 300),
  lema_referencia       text not null check (char_length(lema_referencia) <= 60),
  divisa                text check (char_length(divisa) <= 120),            -- frase do rodapé
  arquidiocese          text not null check (char_length(arquidiocese) <= 120),
  logradouro            text not null check (char_length(logradouro) <= 160),
  bairro                text not null check (char_length(bairro) <= 120),
  cidade                text not null check (char_length(cidade) <= 120),
  cep                   text not null check (char_length(cep) <= 20),
  maps_url              text check (maps_url is null or maps_url ~* '^https://'),
  telefone              text not null check (char_length(telefone) <= 30),
  email                 text not null check (char_length(email) <= 160),
  whatsapp_secretaria   text not null check (whatsapp_secretaria ~ '^[0-9]{10,13}$'), -- só dígitos, com 55 + DDD
  mensagem_whatsapp     text not null check (char_length(mensagem_whatsapp) <= 300),
  secretaria_horario    text not null check (char_length(secretaria_horario) <= 200),
  instagram_url         text check (instagram_url is null or instagram_url ~* '^https://'),
  facebook_url          text check (facebook_url is null or facebook_url ~* '^https://'),
  youtube_url           text check (youtube_url is null or youtube_url ~* '^https://'),
  dizimo_chave_pix      text not null check (char_length(dizimo_chave_pix) <= 120),
  dizimo_favorecido     text not null check (char_length(dizimo_favorecido) <= 160),
  updated_at            timestamptz not null default now()
);

create or replace function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger configuracoes_site_updated_at
  before update on public.configuracoes_site
  for each row execute function public.tocar_updated_at();

-- ---------------------------------------------------------------------
-- Menu de navegação
-- ---------------------------------------------------------------------
create table public.menu_navegacao (
  id     uuid primary key default gen_random_uuid(),
  href   text not null unique check (href ~ '^/[a-z0-9/_-]*$' and char_length(href) <= 120),
  label  text not null check (char_length(label) between 1 and 60),
  ordem  smallint not null default 0,
  ativo  boolean not null default true
);

-- ---------------------------------------------------------------------
-- Pastorais e serviços
-- ---------------------------------------------------------------------
create table public.pastorais (
  slug                text primary key check (slug ~ '^[a-z0-9-]{2,40}$' and slug <> 'dizimo'),
  nome                text not null check (char_length(nome) between 2 and 80),
  resumo              text not null check (char_length(resumo) <= 300),
  icone               text not null default 'maos' check (icone in ('aliancas','vela','calice','maos')),
  sobre               text[] not null default '{}',        -- um item = um parágrafo
  requisitos          text[] not null default '{}',        -- um item = um tópico
  encontros           text not null default '' check (char_length(encontros) <= 300),
  whatsapp            text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  mensagem_whatsapp   text not null default '' check (char_length(mensagem_whatsapp) <= 300),
  formulario_externo  text check (formulario_externo is null or formulario_externo ~* '^https://'),
  ordem               smallint not null default 0,
  ativo               boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Linha do tempo (Quem Somos)
-- ---------------------------------------------------------------------
create table public.linha_do_tempo (
  id     uuid primary key default gen_random_uuid(),
  ano    text not null check (char_length(ano) between 1 and 40),
  texto  text not null check (char_length(texto) <= 600),
  ordem  smallint not null default 0,
  ativo  boolean not null default true
);

-- ---------------------------------------------------------------------
-- Setores aceitos nas inscrições: antes era uma lista fixa no CHECK.
-- Agora vale 'dizimo' + qualquer pastoral ativa da tabela "pastorais".
-- ---------------------------------------------------------------------
alter table public.inscricoes drop constraint if exists inscricoes_setor_check;
alter table public.inscricoes add constraint inscricoes_setor_tamanho check (char_length(setor) between 2 and 40);

create or replace function public.validar_setor_inscricao()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.setor <> 'dizimo'
     and not exists (select 1 from public.pastorais where slug = new.setor and ativo) then
    raise exception 'Setor inválido: %', new.setor using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke execute on function public.validar_setor_inscricao() from public, anon, authenticated;

create trigger inscricoes_validar_setor
  before insert or update of setor on public.inscricoes
  for each row execute function public.validar_setor_inscricao();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.configuracoes_site enable row level security;
alter table public.menu_navegacao     enable row level security;
alter table public.pastorais          enable row level security;
alter table public.linha_do_tempo     enable row level security;

alter table public.configuracoes_site force row level security;
alter table public.menu_navegacao     force row level security;
alter table public.pastorais          force row level security;
alter table public.linha_do_tempo     force row level security;

revoke insert, update, delete, truncate on public.configuracoes_site, public.menu_navegacao, public.pastorais, public.linha_do_tempo from anon, authenticated;
grant select on public.configuracoes_site, public.menu_navegacao, public.pastorais, public.linha_do_tempo to anon, authenticated;
grant insert, update, delete on public.configuracoes_site, public.menu_navegacao, public.pastorais, public.linha_do_tempo to authenticated;

create policy "leitura publica das configuracoes" on public.configuracoes_site
  for select to anon, authenticated using (true);
create policy "leitura publica do menu ativo" on public.menu_navegacao
  for select to anon, authenticated using (ativo);
create policy "leitura publica das pastorais ativas" on public.pastorais
  for select to anon, authenticated using (ativo);
create policy "leitura publica da linha do tempo ativa" on public.linha_do_tempo
  for select to anon, authenticated using (ativo);

create policy "admin gerencia configuracoes" on public.configuracoes_site
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin gerencia menu" on public.menu_navegacao
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin gerencia pastorais" on public.pastorais
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin gerencia linha do tempo" on public.linha_do_tempo
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Dados iniciais (valores que estavam no código). Ajuste depois no Table Editor.
-- ---------------------------------------------------------------------
insert into public.configuracoes_site (
  id, nome, nome_curto, lema, lema_referencia, divisa, arquidiocese,
  logradouro, bairro, cidade, cep, maps_url,
  telefone, email, whatsapp_secretaria, mensagem_whatsapp, secretaria_horario,
  instagram_url, facebook_url, youtube_url, dizimo_chave_pix, dizimo_favorecido
) values (
  1,
  'Paróquia Maria Serva do Senhor',
  'Maria Serva do Senhor',
  'Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.',
  'Lc 1,38',
  'Ad Jesum per Mariam',
  'Arquidiocese de Belo Horizonte',
  'R. dos Médicos, 1008',
  'Alípio de Melo',
  'Belo Horizonte - MG',
  '30840-020',
  'Https://maps.app.goo.gl/Q5Zzd8mamujYA4Yu6?g_st=ic',
  '(31) 99962-5767',
  'contato@paroquiamariaserva.org.br',
  '5531999625767',
  'Olá! Vim pelo site da paróquia.',
  'Segunda a sexta, 8h30 às 12h e 13h às 18h',
  'https://www.instagram.com/paroquiamariaserva/',
  'https://www.facebook.com/paroquiamariaservadosenhor',
  'https://www.youtube.com/channel/UClhWDxRQzFp7oJI2OnJpjrQ',
  '17.505.249/0245-06',
  'Mitra Arquidiocesana de Belo Horizonte'
) on conflict (id) do nothing;

insert into public.menu_navegacao (href, label, ordem) values
  ('/',            'Início',          1),
  ('/missas',      'Missas e Avisos', 2),
  ('/quem-somos',  'Quem Somos',      3),
  ('/eventos',     'Eventos',         4),
  ('/pastorais',   'Pastorais',       5),
  ('/dizimo',      'Dízimo',          6)
on conflict (href) do nothing;

insert into public.pastorais (slug, nome, resumo, icone, sobre, requisitos, encontros, whatsapp, mensagem_whatsapp, ordem) values
  ('casamento', 'Casamento',
   'Prepare-se para o Sacramento do Matrimônio e agende sua celebração.', 'aliancas',
   array[
     'O Matrimônio é a aliança pela qual o homem e a mulher constituem entre si uma comunhão de vida toda, ordenada ao bem dos cônjuges e à geração e educação dos filhos.',
     'A paróquia acompanha os noivos desde o primeiro contato até a celebração, com o curso de preparação, a habilitação matrimonial e o ensaio da cerimônia.'
   ],
   array[
     'Procurar a secretaria com no mínimo 6 meses de antecedência',
     'Certidões de batismo atualizadas (emitidas há menos de 6 meses)',
     'Participação no curso de noivos',
     'Documentos de identidade e comprovante de residência'
   ],
   'Cursos de noivos mensais - consulte as datas pelo WhatsApp.',
   '5531999625767', 'Olá! Gostaria de informações sobre casamento na paróquia.', 1),

  ('coroinhas', 'Coroinhas',
   'Crianças e adolescentes que servem ao altar com alegria e reverência.', 'vela',
   array[
     'Os coroinhas auxiliam o sacerdote nas celebrações litúrgicas, aprendendo desde cedo o amor pela Eucaristia e o serviço à comunidade.',
     'A formação inclui conhecimento da liturgia, dos objetos e vestes litúrgicas e momentos de convivência e oração.'
   ],
   array[
     'Ter feito ou estar na catequese de Primeira Eucaristia',
     'Idade a partir de 9 anos',
     'Autorização dos pais ou responsáveis',
     'Disponibilidade para as formações'
   ],
   'Formação aos sábados pela manhã.',
   '5531999625767', 'Olá! Gostaria de informações para meu filho(a) ser coroinha.', 2),

  ('ministros', 'Ministros Extraordinários',
   'Leigos que auxiliam na distribuição da Sagrada Comunhão e visitam os enfermos.', 'calice',
   array[
     'Os Ministros Extraordinários da Sagrada Comunhão servem a comunidade auxiliando na distribuição da Eucaristia nas missas e levando a Comunhão aos doentes e idosos.',
     'O ministério é assumido após indicação, formação específica e envio pelo pároco.'
   ],
   array[
     'Ser maior de idade e ter recebido os sacramentos de iniciação cristã',
     'Se casado, ser casado na Igreja',
     'Vida de participação ativa na comunidade',
     'Participar da formação arquidiocesana'
   ],
   'Reunião mensal e escala definida pela coordenação.',
   '5531999625767', 'Olá! Gostaria de saber mais sobre o ministério extraordinário da comunhão.', 3),

  ('acolhida', 'Pastoral da Acolhida',
   'O primeiro sorriso de quem chega: acolher cada pessoa como Cristo nos acolhe.', 'maos',
   array[
     'A Pastoral da Acolhida recebe os fiéis na porta da igreja, orienta os visitantes, ajuda os idosos e pessoas com deficiência e cuida para que todos se sintam em casa.',
     'É um serviço simples e essencial, aberto a todos que desejam servir com alegria.'
   ],
   array[
     'Desejo de servir e de acolher',
     'Disponibilidade para participar da escala das missas',
     'Participar das reuniões de formação'
   ],
   'Reunião bimestral; escala mensal.',
   '5531999625767', 'Olá! Gostaria de participar da Pastoral da Acolhida.', 4)
on conflict (slug) do nothing;

insert into public.linha_do_tempo (ano, texto, ordem) values
  ('Origens',  'A comunidade nasce da fé de famílias do bairro que se reuniam para rezar o terço e celebrar a missa.', 1),
  ('Criação',  'A comunidade é elevada a paróquia pela Arquidiocese, sob o título de Maria, Serva do Senhor.', 2),
  ('Hoje',     'Uma família de fé com pastorais, movimentos e serviços que anunciam o Evangelho e cuidam de quem mais precisa.', 3);
