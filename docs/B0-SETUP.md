# B0 — Ativar auth + persistência na nuvem (Supabase)

O código já está pronto. Enquanto as env vars abaixo não existirem, o editor roda em
**modo local** (localStorage), exatamente como antes. Ao configurar, o modo nuvem liga
sozinho: tela de login, carregamento do projeto do usuário e autosave no Postgres.

## Passo a passo (uma vez)

1. **Crie um projeto Supabase** em https://supabase.com (plano free serve).
2. **Rode a migração**: abra _SQL Editor_ no painel do Supabase, cole o conteúdo de
   [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) e execute.
   Isso cria as tabelas `profiles` e `projects`, as políticas de RLS e os triggers.
3. **Pegue as chaves** em _Project Settings → API_:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. **Crie um `.env`** na raiz (copie de `.env.example`) com esses dois valores e
   reinicie o `npm run dev`.
5. (Opcional) Em _Authentication → Providers → Email_, desligue "Confirm email" para
   testar login/cadastro sem precisar confirmar e-mail.

## Como funciona

- `src/lib/supabase/client.ts` — cria o client só se as env vars existirem (`isSupabaseEnabled`).
- `src/lib/supabase/auth.ts` — sessão + `signIn/signUp/signOut` (e-mail + senha).
- `src/components/editor/AuthScreen.tsx` — tela de login/cadastro.
- `src/components/editor/AppRoot.tsx` — decide entre login e editor conforme a sessão.
- `src/lib/supabase/sync.ts` — carrega o projeto do usuário ao logar e salva as alterações
  (debounce de 800ms) na tabela `projects` (1 linha por usuário no B0).
- Segurança: **RLS** garante que cada usuário só lê/escreve as próprias linhas. A `anon key`
  é pública por design — quem protege os dados é a RLS.

## Checklist de verificação (com o Supabase configurado)

- [ ] Abrir o app → aparece a **tela de login**.
- [ ] Criar conta → entra no editor; no header aparece o e-mail + indicador **"Salvo na nuvem"**.
- [ ] Editar algo, recarregar → as mudanças persistem (vieram do Postgres, não do localStorage).
- [ ] No Supabase, tabela `projects` tem 1 linha com seu `owner_id` e o JSON em `data`.
- [ ] Abrir em outro navegador e logar com a mesma conta → o mesmo projeto carrega.
- [ ] Sair (ícone no header) → volta para a tela de login.

## Limites do B0 (próximas fases)

- **1 projeto por usuário** (índice único em `owner_id`). Multi-projeto é fase seguinte —
  basta remover esse índice e adicionar uma UI de seleção de projetos.
- Sem resolução de conflito multi-aba/multi-dispositivo (última escrita vence). Suficiente
  para uso single-user; dá pra evoluir com `updated_at`/optimistic locking depois.
- Pré-requisito para **B1 (preços)**, **B2 (Stripe)** e **B3 (build protegida)** — ver
  [`ARQUITETURA-BACKEND.md`](./ARQUITETURA-BACKEND.md).
