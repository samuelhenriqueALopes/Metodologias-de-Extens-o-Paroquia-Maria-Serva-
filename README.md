# Site da Paróquia Maria Serva do Senhor

Next.js 16 (App Router, TypeScript) - Tailwind CSS 4 - Supabase.

## Páginas

| Rota                                   | Conteúdo                                                                        | Fonte dos dados                           |
| -------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------- |
| `/`                                  | Início: horários, avisos, eventos, pastorais, dízimo                          | Supabase                                  |
| `/missas`                            | Horários de missa e avisos                                                      | Supabase (`horarios_missa`, `avisos`) |
| `/quem-somos`                        | História e missão                                                              | Supabase (`linha_do_tempo`)             |
| `/eventos`                           | Agenda por mês                                                                  | Supabase (`eventos`)                    |
| `/pastorais` e `/pastorais/[slug]` | Casamento, Coroinhas, Ministros, Acolhida - WhatsApp, link externo e formulário | Supabase (`pastorais`)                  |
| `/dizimo`                            | Importância do dízimo, PIX e cadastro de dizimista                             | Supabase (`configuracoes_site`)         |

Formulários gravam na tabela `inscricoes` (acesse pelo painel do Supabase > Table Editor).

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev
```

Sem `.env.local` o site funciona com **dados de exemplo** (`src/content/exemplos.ts`) e os formulários mostram "indisponível".

## Configurar o Supabase

1. Crie um projeto em supabase.com.
2. No **SQL Editor**, execute `supabase/migrations/0001_init.sql` e (opcional) `supabase/seed.sql`. As migrações `0002` (painel) e `0003` (configurações) são executadas depois, como descrito abaixo.
3. Em **Project Settings > API Keys**, crie uma **publishable key** e uma **secret key** e copie, com o `Project URL`, para o `.env.local` (`SUPABASE_PUBLISHABLE_KEY` e `SUPABASE_SECRET_KEY`). Os nomes antigos `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` ainda funcionam como reserva, mas o Supabase vai descontinuá-los até o fim de 2026.
4. Gere o `IP_HASH_SALT` (comando no `.env.example`).

## Painel da secretaria (`/admin`)

Login com Supabase Auth. Permite cadastrar/editar/excluir **avisos** (com agendamento e expiração), **horários de missa** e **eventos**, e ver as **inscrições** (filtro por setor/status, mudar status, chamar no WhatsApp, excluir a pedido - LGPD). Alterações aparecem no site na hora.

Configuração:

1. Rode `supabase/migrations/0002_painel_admin.sql` no SQL Editor.
2. **Authentication > Sign In / Providers:** desative *Allow new users to sign up* (ninguém cria conta sozinho).
3. **Authentication > Users > Add user:** e-mail + senha forte (marque *Auto Confirm*).
4. Libere o acesso ao painel para o usuário criado rodando no SQL Editor:
   ```sql
   insert into public.administradores (user_id, nome)
   select id, 'Secretaria' from auth.users where email = 'secretaria@exemplo.com';
   ```
5. Acesse `/admin/login`.

Para remover o acesso de alguém: `delete from public.administradores where user_id = '...'`.

Segurança do painel:

- Só quem está em `administradores` entra - ter conta no Auth não basta (verificado no login, em cada página e em cada ação).
- O painel grava com a **sessão do usuário**, não com a secret key: o RLS do banco é a última barreira mesmo se houver bug no código.
- Inscrições: o admin só pode alterar a coluna `status` (grant por coluna).
- Cookies de sessão `httpOnly` + `SameSite=Lax` + `Secure` em produção.
- Mensagem de erro de login genérica e bloqueio após 5 tentativas erradas em 15 min por IP.
- `/admin` com `noindex`, `Cache-Control: no-store` e fora do `robots.txt`.

## Configurações editáveis no banco (sem novo build)

Rode `supabase/migrations/0003_configuracoes_no_banco.sql` no SQL Editor. Ela cria as tabelas abaixo **já preenchidas com os valores atuais**; edite-as em **Supabase > Table Editor** e a mudança aparece no site em até ~1 minuto, sem mexer no código nem rodar `npm run build`.

| Tabela                                       | O que controla                                                                                                                                                                                                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configuracoes_site` (1 linha, `id = 1`) | Nome, lema, arquidiocese, endereço, "Como chegar", telefone, e-mail, WhatsApp da secretaria e mensagem padrão, horário da secretaria, redes sociais (vazio = ícone some), frase do rodapé, chave PIX e favorecido                                          |
| `menu_navegacao`                           | Links do menu (cabeçalho, rodapé e sitemap): `label`, `href`, `ordem`, `ativo`                                                                                                                                                                        |
| `pastorais`                                | Pastorais e serviços: textos (`sobre` e `requisitos` são listas), WhatsApp, mensagem, formulário externo, `ordem`, `ativo`. **Para criar uma nova, basta inserir uma linha** - o formulário de inscrição passa a aceitá-la automaticamente |
| `linha_do_tempo`                           | Marcos da página "Quem Somos"                                                                                                                                                                                                                                  |

Os arquivos `src/config/site.ts` e `src/content/pastorais.ts` agora guardam apenas **valores padrão de reserva** (usados sem Supabase ou se a migração ainda não rodou). Continuam no ambiente/código: `NEXT_PUBLIC_SITE_URL` (configuração de implantação), os textos longos das páginas e os ícones das pastorais (`aliancas`, `vela`, `calice`, `maos` - um ícone novo exige código).

## Segurança

- **Nenhuma chave no navegador**: o Supabase só é acessado pelo servidor (`server-only`). Nem a publishable key é exposta.
- **RLS em todas as tabelas** (`force row level security`): visitantes só leem conteúdo publicado; `inscricoes` não tem nenhuma policy para `anon`/`authenticated` e os privilégios foram revogados.
- **Restrições CHECK no banco** (tamanho, formato de telefone/e-mail, setores válidos, links só `https://`).
- **Server Action com validação Zod**, honeypot anti-robô, tempo mínimo de preenchimento e **limite de 5 envios / 15 min por IP** (IP guardado só como SHA-256 com sal - LGPD). Erros do banco nunca são mostrados ao visitante. Server Actions do Next já verificam a origem (proteção CSRF).
- **Cabeçalhos HTTP**: CSP restritiva, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP; `X-Powered-By` removido.
- **Links externos** com `rel="noopener noreferrer"`; links de WhatsApp e de inscrição são validados (só dígitos / só `https`).
- Consentimento explícito (LGPD) nos formulários.

### Ao publicar

- Hospede na Vercel (ou similar com HTTPS) e cadastre as variáveis de ambiente no painel - nunca faça commit do `.env.local`.
- No Supabase: ative MFA na sua conta, não compartilhe a secret key (use uma por componente e revogue as chaves legadas `anon`/`service_role` em API Keys), e mantenha backups ativos.
- Rode `npm audit` periodicamente e mantenha Next/Supabase atualizados.
