## Status atual

Após a auditoria, **a maior parte do que você pediu já está implementada**:

- **CRUD de FAQ no admin** → `Admin → FAQs` (`AdminFaqs.tsx`) já permite criar, editar, reordenar, ocultar e excluir perguntas/respostas. Tudo é lido por `FAQSection` e cai num fallback de 6 perguntas se a tabela estiver vazia.
- **WhatsApp reforçado** → `FAQSection` (com botão verde "Falar no WhatsApp") já está montado em `Index.tsx` (Home), `Loja.tsx` e `ProductPage.tsx`.
- **Schema.org** → `FAQStructuredData` (FAQPage) renderiza junto da seção de FAQ; `ProductStructuredData` (Product + Offer + AggregateRating) renderiza em cada página de produto.
- **Sitemap + GSC** → `generate-sitemap` regenerado agora (152 URLs) e reenviado ao Google Search Console na propriedade de domínio `sc-domain:emporiolelecute.com.br` → resposta `HTTP 204` (aceito, isPending: true).

Não há código novo a escrever para o pedido literal — está tudo em produção. O que falta é avançar com a próxima onda de gestão pelo painel administrativo.

---

## Plano: o que ainda NÃO é gerenciável pelo painel

Itens hoje hardcoded ou parcialmente gerenciáveis, em ordem de impacto:

### Tier 1 — alto impacto na conversão (recomendo fazer já)

1. **HeroSlider (slides do topo da Home)** — slides, títulos, subtítulos, imagens, CTAs e ordem ainda vivem em `HeroSlider.tsx`.
   → Nova tabela `hero_slides` + `Admin → Hero Slides` (CRUD com upload de imagem, drag-and-drop de ordem, toggle de visibilidade, agendamento opcional).
2. **Depoimentos (`Testimonials.tsx`)** — nomes, fotos, avaliações e textos hardcoded.
   → Nova tabela `testimonials` + `Admin → Depoimentos`.
3. **Seção "Sobre" (`About.tsx`)** — texto institucional, imagem e bullets fixos.
   → Reaproveitar `pages` (slug `sobre`) já existente, ou expor um bloco no `Admin → Homepage Blocks`.
4. **WhatsApp/contato global** — número `(41) 99221-4299` repetido em ~10 arquivos.
   → Ler tudo de `store_settings.contact_info` (já existe no DB) e remover hardcodes; expor mensagens padrão do WhatsApp por contexto (FAQ, produto, carrinho, orçamento) no `Admin → Configurações`.

### Tier 2 — operacional / SEO

5. **Botão flutuante WhatsApp (`WhatsAppButton.tsx`)** — texto e visibilidade.
6. **QuoteForm (formulário de orçamento)** — campos, e-mail destino e mensagens fixos.
7. **Chatbot (`Chatbot.tsx`)** — mensagens de boas-vindas, respostas rápidas e prompts.
8. **Robots.txt dinâmico** — hoje é estático em `public/robots.txt`. Migrar para edge function que monte a partir de `store_settings.seo_config` (incluir/excluir paths, modo "site privado", liberar/bloquear bots).
9. **Redirects 301** — nova tabela `redirects` (de → para → status) + edge function de rewrite, para gerir mudanças de URL sem perder ranking.
10. **Cupons / promoções globais** — banner topo, código de cupom, percentual.
11. **Política de frete e prazos** — texto exibido em produto/checkout.

### Tier 3 — marca e tema

12. **Tema (cores, fontes, logo, favicon)** — hoje em `index.css`, `tailwind.config.ts` e `public/`. Mover paleta principal para `store_settings.theme_config` lido em runtime via CSS vars; upload de logo/favicon pelo admin.
13. **Meta-tags por rota** — ampliar `DynamicSEO` para ler título/descrição/OG por rota numa nova tabela `route_seo`.
14. **Tracking IDs (GA4, Meta Pixel, GSC)** — mover do código para `Admin → Configurações → Tracking`.

### Tier 4 — qualidade de vida

15. **Blog/Notícias** — tabela `posts` + admin (gera autoridade SEO).
16. **Cupons por cliente / leads capturados** — captura de e-mail no popup/footer.
17. **Auditoria de admin** — log de quem alterou o quê (tabela `admin_audit_log`).

---

## Validação Rich Results (a fazer manualmente)

Os schemas já estão no HTML, mas o Google só valida páginas publicadas. Após a publicação:

- Home: https://search.google.com/test/rich-results?url=https://emporiolelecute.com.br/ → deve detectar `Organization`, `WebSite`, `LocalBusiness`, `FAQPage`.
- Produto exemplo: testar uma URL de `/produto/{slug}` → deve detectar `Product` + `Offer` + `BreadcrumbList`.
- Loja: https://search.google.com/test/rich-results?url=https://emporiolelecute.com.br/loja → `ItemList` + `FAQPage`.

Se algum item aparecer com aviso, eu corrijo o componente correspondente.

---

## O que peço de você para seguir

Diga **quais itens dos Tiers 1–4 você quer que eu implemente agora** (pode escolher por número, ex.: "Tier 1 inteiro", ou "1, 4, 8, 12"). Por padrão eu sugiro começar pelo **Tier 1 completo**, que é o que mais altera percepção do cliente e ainda envolve conteúdo que muda com frequência.