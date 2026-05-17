## 1. Ajustes visuais no carrossel `OccasionsThumbs`

- Setas **sempre visíveis** também no mobile (hoje só desktop ganhou setas).
- Setas reagem ao estado real de rolagem (`canLeft`/`canRight`) — quando não há mais conteúdo, somem suavemente.
- Setas posicionadas **sobre** o scroller (não fora do container), com offset que não corta em telas estreitas (≤ 360px).
- Padding vertical (`py-4`) e horizontal (`px-8 md:px-12`) para acomodar o lift do hover, a animação `pingpong` e o anel ativo sem cortar topo/laterais.
- Fades laterais ligados ao estado de rolagem (somem quando `!canLeft` / `!canRight`).
- Dica visual de rolagem: na primeira renderização (apenas se `canRight`), um chevron sutil pulsando à direita por ~3s.

## 2. CMS completo das seções da home

Nova tabela `home_sections` (separada de `homepage_blocks` para não misturar semântica de conteúdo com semântica de layout):

```text
home_sections
├── id (uuid)
├── section_key (text, unique)        ── identificador estável usado no Index.tsx
├── component_name (text)              ── nome do componente React
├── label (text)                       ── nome amigável no admin
├── description (text)                 ── descrição curta
├── is_visible (boolean, default true)
├── position (int)                     ── ordem na home
├── editable_props (jsonb)             ── overrides opcionais (título, etc.)
├── created_at / updated_at
```

Seed inicial com todas as seções atuais da home:
`HeroSlider`, `CategoriesScroll`, `OccasionsThumbs`, `BestSellers`, `QuoteCTABanner`, `Testimonials`, `FAQSection`, `InstagramFeed`.

`src/pages/Index.tsx` deixa de hard-codear a ordem e passa a iterar sobre `home_sections` ordenadas por `position`, renderizando dinamicamente cada componente via um **registry tipado** `src/lib/homeSectionsRegistry.ts` (mapa `component_name → React.ComponentType`).

A linha `section_categories_scroll` criada anteriormente em `homepage_blocks` é migrada para `home_sections` e a antiga é removida.

## 3. Painel administrativo `AdminHomeSections`

Nova rota: `/admin/secoes-home` (entrada no menu lateral do admin).

Funcionalidades:
- Lista de seções em **cards arrastáveis** (`@dnd-kit/sortable` — já instalado).
- Cada card mostra: nome, descrição, badge de visibilidade, switch oculto/visível, botão editar, botão "Ver prévia".
- Drag & drop reordena e persiste `position` em batch (uma transação por drop).
- Botão "Editar" abre dialog com campos editáveis (label/description e qualquer prop registrada como editável em `editable_props`).

## 4. Prévia ao vivo

Página adicional `/admin/secoes-home/preview/:section_key`:
- Renderiza o componente real isolado dentro de um iframe-like container com `Header`/`Footer` opcionais.
- Botão "Salvar visibilidade" disponível direto na prévia.
- Toggle "preview com dados reais" (default) vs "preview com placeholder" (quando o componente depende de dados que possam não existir em produção).

Implementação: cliente-side simples (sem iframe real) — usamos o mesmo registry e montamos o componente dentro de um wrapper com `aria-label="Prévia"`.

## 5. Log de auditoria

Nova tabela `home_section_audit`:

```text
home_section_audit
├── id (uuid)
├── section_key (text)
├── action (text)                      ── 'visibility_changed' | 'reordered' | 'edited'
├── old_value (jsonb)
├── new_value (jsonb)
├── changed_by (uuid → auth.users)
├── changed_by_email (text)
├── created_at
```

Trigger `home_sections_audit_trigger` em `AFTER UPDATE` em `home_sections` registra automaticamente mudanças de `is_visible`, `position` e `editable_props`.

Aba "Histórico" no painel mostra timeline (data, usuário, ação, antes → depois).

## 6. RLS e segurança

- `home_sections`: leitura pública, escrita só para `admin`/`editor`.
- `home_section_audit`: leitura só para `admin`, escrita só via trigger (`SECURITY DEFINER`).

## 7. Detalhes técnicos

- Migration única criando `home_sections` + `home_section_audit` + RLS + trigger + seed.
- Hook `useHomeSections.ts` (query + mutations + reorder em batch).
- `Index.tsx` consome `useHomeSections()` com fallback para a ordem hard-coded enquanto carrega (evita FOUC).
- Loading skeleton para preservar altura aproximada das seções enquanto a query roda.
- Componentes do registry usam `React.lazy` para não inflar o bundle do admin.

## 8. Fora de escopo

- Não substitui `homepage_blocks` (continua gerenciando blocos de conteúdo internos como categorias em destaque).
- Não move `Header`/`Footer` para o CMS (continuam fixos).
- Não toca em SEO ou structured data (continuam renderizados sempre).
