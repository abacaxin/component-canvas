# Arquitetura de Backend — SANGRE (proposta)

> Documento de proposta. Cobre os requisitos que **não** são viáveis no app puramente
> client-side atual: **#6 Precificação modular**, **#7 Proteção do código e liberação
> após pagamento** e a parte de **#10 que depende de servidor (CDN + conversão WebP/AVIF)**.
> As demais features (tipografia, edição estrutural, multi-página, DnD, biblioteca) rodam
> 100% no front-end e não dependem disto.

Estado atual: editor React/TanStack Start, projeto salvo em `localStorage`, export gera
HTML como blob no navegador. Não há contas, banco, pagamento nem storage. Para os itens
6/7/10 isso precisa mudar.

---

## 1. Visão geral da stack proposta

Mantendo o que já existe (TanStack Start + React) e adicionando o mínimo necessário:

| Camada | Escolha recomendada | Alternativa | Porquê |
| --- | --- | --- | --- |
| API / server | **TanStack Start server functions** (mesmo repo) | Node/Fastify separado | Já temos SSR; evita um segundo serviço |
| Banco | **Postgres (Supabase ou Neon)** | PlanetScale/MySQL | Relacional cai bem para planos/entitlements; Supabase já traz Auth + Storage |
| Auth | **Supabase Auth** (ou Clerk) | Auth.js | E-mail/OAuth prontos, RLS no banco |
| Pagamento | **Stripe** (Checkout + Billing + Webhooks) | — | Padrão de mercado, suporta plano-base + add-ons |
| Storage de builds | **Cloudflare R2** ou S3 | Supabase Storage | Objetos privados + URLs assinadas |
| Imagens (#10) | **Cloudflare Images** ou **imgproxy** atrás de CDN | Cloudinary | Transformação on-the-fly, WebP/AVIF, focal point |

> Decisão-chave: **Supabase** resolve Auth + Postgres + Storage num pacote só e encurta muito
> o caminho para uma equipe pequena. Stripe e a CDN de imagens entram por cima.

Pré-requisito para tudo: **persistir projetos no servidor** (hoje só `localStorage`).
Ver §5 (migração).

---

## 2. #6 — Precificação modular

### Modelo de dados

```
plans            (id, nome, preco_base_centavos, limites_json, ativo)
features         (id, chave, nome, tipo['boolean'|'quantidade'], preco_unit_centavos)
plan_features    (plan_id, feature_id, incluido_qtd)        -- o que já vem no plano
projects         (id, owner_id, plan_id, nome, criado_em)
project_features (project_id, feature_id, quantidade)        -- add-ons escolhidos
```

`limites_json` do plano guarda cotas (ex.: `{ "paginas": 1, "secoes": 5 }`).
`features.chave` são as unidades cobráveis descritas no requisito: `pagina_extra`,
`componente_premium`, `dominio_custom`, `export_codigo`, `ia`, `analytics`, etc.

### Cálculo

Função pura, **compartilhada entre front e back** (mesmo `.ts`), para o preview no editor
bater exatamente com a cobrança:

```ts
function precoProjeto(plan, addons): number {
  let total = plan.preco_base_centavos;
  for (const a of addons) {
    const incluido = plan_features[plan.id][a.feature_id]?.incluido_qtd ?? 0;
    const excedente = Math.max(0, a.quantidade - incluido);
    total += excedente * feature.preco_unit_centavos;
  }
  return total;
}
```

- **Front-end**: mostra o valor em tempo real conforme o usuário liga recursos (é só chamar
  a função pura com o catálogo carregado da API).
- **Back-end**: recalcula **de novo** no servidor antes de criar a sessão de pagamento —
  nunca confiar no preço vindo do cliente.

### Cobrança

`plan.preco_base` vira uma **subscription** no Stripe; add-ons quantitativos viram
`subscription items` com `quantity`. Recursos one-off (ex.: exportar código de um projeto)
podem ser um **Checkout de pagamento único**.

---

## 3. #7 — Proteção do código e liberação após pagamento

O problema hoje: `exportHTML()` roda no navegador, então qualquer um lê o código gerado no
DevTools. Para "bloquear até pagar", **a geração da build tem que sair do cliente**.

### Fluxo

```
1. Usuário monta o projeto            → salvo no banco (JSON das seções + tipografia)
2. Clica em "Gerar build"             → POST /api/builds  (server)
3. Server renderiza o HTML/código     → renderToStaticMarkup no servidor
4. Salva no R2 como objeto PRIVADO    → builds/{buildId}.zip  (sem ACL pública)
5. Grava builds(status='locked')      → nenhuma URL é devolvida ainda
6. Usuário paga (Stripe Checkout)     → webhook checkout.session.completed
7. Webhook marca entitlement=granted  → build vira 'unlocked'
8. Download → GET /api/builds/:id/url → server checa entitlement e devolve
                                        URL ASSINADA e expirável (ex.: 15 min)
```

### Mecanismos

- **Objetos privados**: o bucket R2/S3 não é público; só o server acessa.
- **URLs temporárias assinadas**: `getSignedUrl(..., { expiresIn: 900 })`. Expira sozinha.
- **Entitlement no banco** (`entitlements(user_id, project_id, tipo, status)`): a rota de
  download **sempre** verifica antes de assinar a URL. Pagamento é a fonte da verdade, não a UI.
- **Assinatura da build** (opcional, "assinatura digital" do requisito): gerar um hash
  (SHA-256) do artefato + registrar em `builds.checksum`; se quiser prova de integridade,
  assinar o checksum com uma chave do servidor (HMAC) e embutir no manifesto.
- **Webhook como gatilho** (nunca o front): só o `checkout.session.completed`/`invoice.paid`
  vindo do Stripe (validado por assinatura) libera. O front apenas faz polling do status.

> Regra de ouro: o cliente **nunca** recebe o código antes de o servidor confirmar o
> entitlement. O preview no editor continua sendo renderização em runtime (componentes React),
> não o código-fonte exportável.

---

## 4. #10 — Sistema de imagens (parte de servidor)

A parte client-side (crop, focal point, lazy loading, preview) pode ser feita no front.
O que precisa de infra é **armazenamento + CDN + conversão de formato**.

### Fluxo

```
Upload → POST /api/assets (URL assinada de upload direto p/ R2)
       → registro em assets(id, owner_id, url, w, h, focal_x, focal_y)
Entrega → https://cdn.seudominio.com/{assetId}?w=800&format=auto&fit=cover&gravity=focal
```

- **Cloudflare Images** ou **imgproxy** atrás da CDN fazem resize/crop/format **on-the-fly**.
- `format=auto` → serve **AVIF/WebP** conforme o `Accept` do browser, com fallback JPEG.
- **Focal point**: guardamos `focal_x/focal_y` (0–1) no asset; a URL passa `gravity` para o
  crop respeitar o ponto de interesse — o usuário nunca ajusta dimensão na mão.
- **Lazy loading**: já aplicável no front (`loading="lazy"`, já colocamos nos blocks de imagem).
- O editor pede sempre a variante do tamanho do layout (`srcset` com larguras), sem originais pesados.

---

## 5. Migração necessária (pré-requisito comum)

1. **Auth**: introduzir login (Supabase Auth). Projetos passam a ter `owner_id`.
2. **Persistência**: `projects.data_json` guarda `{ sections, typography, pages }`. O hook
   `useProject` passa a sincronizar com a API (mantendo `localStorage` como cache/otimista).
3. **Catálogo**: `plans`/`features` viram dados no banco, servidos por `/api/catalog`.

Nada disso quebra as features client-side já entregues — elas continuam funcionando offline;
o backend só adiciona conta, cobrança e entrega protegida por cima.

---

## 6. Fases sugeridas

| Fase | Entrega | Depende de |
| --- | --- | --- |
| B0 | Auth + persistência de projetos no Postgres | — |
| B1 | Catálogo de planos/features + cálculo de preço (front + back) — **#6** | B0 |
| B2 | Stripe Checkout/Billing + webhooks + entitlements | B1 |
| B3 | Geração de build no servidor + R2 privado + URLs assinadas — **#7** | B2 |
| B4 | Pipeline de imagens (upload + CDN + AVIF/WebP + focal point) — **#10** | B0 |

Estimativa grosseira para equipe pequena: B0–B2 são o grosso do esforço (semanas), B3 e B4
são incrementais depois que auth+billing existem.
