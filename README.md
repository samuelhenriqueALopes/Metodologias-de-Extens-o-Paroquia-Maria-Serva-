# Site da Paróquia Maria Serva do Senhor

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Supabase.

## Páginas

| Rota | Conteúdo | Fonte dos dados |
|---|---|---|
| `/` | Início: horários, avisos, eventos, pastorais, dízimo | Supabase |
| `/missas` | Horários de missa e avisos | Supabase (`horarios_missa`, `avisos`) |
| `/quem-somos` | História e missão | `src/app/quem-somos/page.tsx` |
| `/eventos` | Agenda por mês | Supabase (`eventos`) |
| `/pastorais` e `/pastorais/[slug]` | Casamento, Coroinhas, Ministros, Acolhida — WhatsApp, link externo e formulário | `src/content/pastorais.ts` |
| `/dizimo` | Importância do dízimo, PIX e cadastro de dizimista | `src/config/site.ts` |

Formulários gravam na tabela `inscricoes` (acesse pelo painel do Supabase → Table Editor).

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves
npm run dev
```

Sem `.env.local` o site funciona com **dados de exemplo** (`src/content/exemplos.ts`) e os formulários mostram "indisponível".

## Configurar o Supabase

1. Crie um projeto em supabase.com.
2. No **SQL Editor**, execute `supabase/migrations/0001_init.sql` e (opcional) `supabase/seed.sql`.
3. Copie `Project URL`, `anon key` e `service_role key` para o `.env.local`.
4. Gere o `IP_HASH_SALT` (comando no `.env.example`).

## Painel da secretaria (`/admin`)

Login com Supabase Auth. Permite cadastrar/editar/excluir **avisos** (com agendamento e expiração), **horários de missa** e **eventos**, e ver as **inscrições** (filtro por setor/status, mudar status, chamar no WhatsApp, excluir a pedido — LGPD). Alterações aparecem no site na hora.

Configuração:

1. Rode `supabase/migrations/0002_painel_admin.sql` no SQL Editor.
2. **Authentication → Sign In / Providers:** desative *Allow new users to sign up* (ninguém cria conta sozinho).
3. **Authentication → Users → Add user:** e-mail + senha forte (marque *Auto Confirm*).
4. Libere o acesso ao painel:
   ```sql
   insert into public.administradores (user_id, nome)
   select id, 'Secretaria' from auth.users where email = 'secretaria@exemplo.com';
   ```
5. Acesse `/admin/login`.

Para remover o acesso de alguém: `delete from public.administradores where user_id = '...'`.

Segurança do painel:
- Só quem está em `administradores` entra — ter conta no Auth não basta (verificado no login, em cada página e em cada ação).
- O painel grava com a **sessão do usuário**, não com a `service_role`: o RLS do banco é a última barreira mesmo se houver bug no código.
- Inscrições: o admin só pode alterar a coluna `status` (grant por coluna).
- Cookies de sessão `httpOnly` + `SameSite=Lax` + `Secure` em produção.
- Mensagem de erro de login genérica e bloqueio após 5 tentativas erradas em 15 min por IP.
- `/admin` com `noindex`, `Cache-Control: no-store` e fora do `robots.txt`.

## O que editar primeiro (marcado com `TODO`)

- `src/config/site.ts` — endereço, telefones, WhatsApp, redes sociais, chave PIX.
- `src/content/pastorais.ts` — WhatsApp de cada pastoral, textos, link de formulário externo.
- `src/app/quem-somos/page.tsx` — linha do tempo com a história real da paróquia.

## Segurança

- **Nenhuma chave no navegador**: o Supabase só é acessado pelo servidor (`server-only`). Nem a anon key é exposta.
- **RLS em todas as tabelas** (`force row level security`): visitantes só leem conteúdo publicado; `inscricoes` não tem nenhuma policy para `anon`/`authenticated` e os privilégios foram revogados.
- **Restrições CHECK no banco** (tamanho, formato de telefone/e-mail, setores válidos, links só `https://`).
- **Server Action com validação Zod**, honeypot anti-robô, tempo mínimo de preenchimento e **limite de 5 envios / 15 min por IP** (IP guardado só como SHA-256 com sal — LGPD). Erros do banco nunca são mostrados ao visitante. Server Actions do Next já verificam a origem (proteção CSRF).
- **Cabeçalhos HTTP**: CSP restritiva, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP; `X-Powered-By` removido.
- **Links externos** com `rel="noopener noreferrer"`; links de WhatsApp e de inscrição são validados (só dígitos / só `https`).
- Consentimento explícito (LGPD) nos formulários.

### Ao publicar

- Hospede na Vercel (ou similar com HTTPS) e cadastre as variáveis de ambiente no painel — nunca faça commit do `.env.local`.
- No Supabase: ative MFA na sua conta, não compartilhe a `service_role`, e mantenha backups ativos.
- Rode `npm audit` periodicamente e mantenha Next/Supabase atualizados.
