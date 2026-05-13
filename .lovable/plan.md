
# Auditoria SEO Profunda — Empório LeleCute

## 1. Diagnóstico atual (dados Semrush, base BR)

| Métrica | Valor | Leitura honesta |
|---|---|---|
| Authority Score | **2/100** | Site novo aos olhos do Google. É o maior gargalo. |
| Trust Score | **2/100** | Praticamente nenhum sinal de confiança externa. |
| Domínios referentes | **3** (sendo 1 com 1.467 backlinks = PBN/diretório de baixíssima qualidade) | Perfil de backlinks frágil e potencialmente tóxico. |
| Tráfego orgânico estimado | **0/mês** | Nenhuma keyword no top 10 com volume real. |
| Keywords ranqueadas | **5** | Apenas long-tails de baixíssimo volume (90–140/mo). |
| Melhor posição | #10 ("sabonete personalizado lembrancinha") | Borda da página 1 — alvo prioritário. |

### Ponto crítico — expectativa vs realidade
**"Primeira posição para 'artesanato' HOJE" não é tecnicamente possível.** Esse termo tem 40.500 buscas/mês, KDI 52, e o SERP é dominado por Mercado Livre, Elo7, Shopee e marketplaces com Authority Score 80+. Um site com AS 2 não ranqueia ali em meses, quanto mais em um dia. Qualquer agência que prometer isso está mentindo.

**O que é possível em 30–90 dias:** dominar nichos long-tail de alta intenção comercial onde a concorrência é fraca e você já está perto. Esse é o plano abaixo.

---

## 2. Auditoria técnica do código (achados)

| # | Problema | Impacto | Onde |
|---|---|---|---|
| T1 | `og:image` aponta para `img.elo7.com.br` (CDN de terceiro/concorrente) — péssimo para branding e arriscado se o link quebrar | Alto | `index.html`, `LocalBusinessStructuredData`, `OrganizationStructuredData` |
| T2 | JSON-LD de `Product` com produtos hardcoded no `index.html` apontando imagens do Elo7 — Google pode penalizar por dados estruturados desatualizados/incorretos | Alto | `index.html` |
| T3 | `AggregateRating` com `reviewCount: 5000` sem reviews reais visíveis na página → violação das diretrizes do Google, risco de manual action | **Crítico** | `LocalBusinessStructuredData.tsx` |
| T4 | Endereço fictício "Rua do Ateliê" no schema LocalBusiness | Médio | `LocalBusinessStructuredData.tsx` |
| T5 | `numberOfEmployees: 5` e `foundingDate: 2014` chutados | Baixo | `OrganizationStructuredData.tsx` |
| T6 | Páginas de produto/categoria não têm `<title>` e `<meta description>` únicos por rota (SPA com Helmet, mas SSR-less — preview social não pega) | Alto | rotas dinâmicas |
| T7 | Sem H1 garantido por página, sem schema `BreadcrumbList` em todas as rotas | Médio | rotas dinâmicas |
| T8 | `sitemap.xml` aponta para `sitemap2.xml` + edge function — verificar se ambos retornam URLs válidas e atualizadas | Médio | `public/sitemap.xml` |
| T9 | Backlinks 99% vêm de `precisodeumprofissional.com.br` (1.467 links, AS 0) — perfil parece PBN, risco de filtro algorítmico | **Crítico** | externo |
| T10 | Sem conteúdo editorial (blog, guias) — só páginas de produto. Google premia E-E-A-T em artesanato. | Alto | estrutura |

---

## 3. Oportunidades de keywords (quick wins reais)

Termos onde o site já aparece ou tem chance real (KDI ≤ 30, intenção comercial):

| Keyword | Volume/mo | KDI | Posição atual | Ação |
|---|---|---|---|---|
| sabonete personalizado lembrancinha | 90 | fácil | **#10** | Otimizar página → top 3 em ~30 dias |
| sabonete personalizado para lembrancinha | 140 | fácil | #22 | Mesma página, melhorar |
| sabonete fundo do mar | 110 | fácil | #15 | Página de produto já existe |
| lembrancinhas maternidade | 1.900 | 28 (fácil) | – | Criar landing dedicada |
| lembrancinhas maternidade sabonete | 90 | fácil | #45 | Mover p/ top 10 |
| lembrancinhas artesanais | 90 | 18 (fácil) | – | Landing + blog post |
| como fazer sabonete artesanal para lembrancinhas | 140 | fácil | – | **Blog post** (intenção informacional, ótimo p/ E-E-A-T) |
| loja de artesanato | 3.600 | médio | – | Landing `/loja` (já existe, otimizar) |

---

## 4. PLANO — 3 horizontes

### HORIZONTE 1 — HOJE (correções críticas, 100% técnico)
Sem isso o resto não rende. Posso executar agora:

1. **Remover `AggregateRating` falso** do schema (T3) — risco de penalidade manual.
2. **Substituir todas as imagens `img.elo7.com.br`** nos schemas e og:image por imagem própria hospedada no Supabase (T1, T2).
3. **Corrigir endereço** ou remover `streetAddress` fictício (T4).
4. **Remover dados chutados** (`numberOfEmployees`, `reviewCount`) (T5).
5. **Atualizar JSON-LD `Product`** no `index.html` para refletir produtos reais do banco (ou remover e gerar dinâmico por página).
6. **Adicionar `<title>` e `<meta description>` únicos** por página de produto/categoria via Helmet (T6).
7. **Validar sitemap** — garantir que todas as URLs públicas (produtos, categorias, páginas) estão lá.

### HORIZONTE 2 — 7–30 DIAS (conteúdo + on-page)
1. **Otimizar página `/produtos`** para "sabonete personalizado lembrancinha" (já em #10 → meta top 3): H1 exato, 800+ palavras de copy, FAQ, schema Product completo com preços reais.
2. **Criar landing `/lembrancinhas-maternidade`** (volume 1.900/mo, KDI 28). SERP é dominado por Shopee/ML — espaço para artesão autêntico com fotos reais.
3. **Lançar blog `/blog`** com 4 posts iniciais:
   - "Como fazer sabonete artesanal para lembrancinhas" (140/mo, KDI baixo)
   - "Ideias de lembrancinhas para chá de bebê"
   - "Lembrancinhas de maternidade: guia completo 2026"
   - "Vela perfumada artesanal: como escolher"
4. **Internal linking** — toda página de produto linka para a categoria e blog post relacionado.
5. **Schema Review real** — coletar reviews reais de clientes (Instagram, WhatsApp) e exibir na página com schema válido.

### HORIZONTE 3 — 30–90 DIAS (autoridade)
Aqui está o trabalho que realmente sobe Authority Score de 2 para 15–25:

1. **Disavow** dos backlinks de `precisodeumprofissional.com.br` (1.467 links suspeitos) via Google Search Console.
2. **Link building genuíno**:
   - Cadastro em diretórios reais: Elo7 (já tem), GetNinjas, guias locais de Curitiba/SJP.
   - Parcerias com blogs de maternidade brasileiros (guest posts).
   - Press releases para portais regionais do Paraná.
3. **Google Business Profile** otimizado (aparece em "loja de artesanato perto de mim" — 2.400/mo).
4. **Pinterest + Instagram** com links para o site (artesanato performa muito bem em Pinterest BR).
5. **YouTube short** — "como embalo minhas lembrancinhas" — backlink no canal.

---

## 5. O que vou fazer AGORA se você aprovar

Apenas o **Horizonte 1** (técnico, ~30 min de trabalho):
- Corrigir os 5 problemas críticos de schema (T1–T5)
- Adicionar SEO dinâmico em páginas de produto e categoria (T6)
- Validar e ajustar sitemap

Os Horizontes 2 e 3 envolvem decisões suas (quer blog? quais posts? quer landing nova?) e ações fora do código (disavow, link building, GBP) — posso te guiar passo a passo depois.

---

## Detalhes técnicos
- Stack: Vite + React + react-helmet (já instalado).
- Schema corrigido seguindo schema.org/Product, sem `AggregateRating` até existirem reviews reais.
- SEO dinâmico via novo componente `<ProductSEO>` consumindo dados do produto carregado.
- Disavow file gerado como `.txt` para upload no GSC.

