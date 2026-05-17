# CONSTITUIÇÃO TAXONÔMICA — EMPÓRIO LELECUTE
## Governança Estrutural de Categorias, Ocasiões, Segmentos e Tags

> **Modo:** SAFE MODE ABSOLUTO — somente documentação. Nenhuma migration, rename, redirect, deduplicação ou alteração de dados foi executada.
> **Versão:** 1.0 · **Status:** Oficial · **Aplicabilidade:** loja, admin, SEO OS, equipe de conteúdo

---

## SUMÁRIO

1. Definições conceituais
2. Matriz de decisão (onde cada conceito entra)
3. Regras de governança (criação, naming, slugs, indexação, volume)
4. Diagnóstico da estrutura atual
5. Plano de escalabilidade futura
6. Entregáveis: Lei das 4 Taxonomias · Checklist Anti-Caos · Riscos · Recomendações

---

## 1. DEFINIÇÕES CONCEITUAIS

### 1.1 CATEGORY — "o que o produto É"
- **Pergunta:** _qual o tipo físico/funcional do produto?_
- **Exemplos válidos:** Sabonete, Vela, Escalda-pés, Sachê, Difusor
- **Características:** obrigatória, estrutural, baixa volatilidade, principal taxonomia SEO, presente em menu, home, breadcrumbs, URLs canônicas (`/categoria/{slug}`).
- **Critérios para existir:**
  - ≥ 6 produtos previstos no curto prazo
  - intenção de busca clara (volume de pesquisa real ou estratégico)
  - diferenciação física/funcional inequívoca de qualquer outra categoria
- **NÃO criar quando:** for um tema, momento, público, ou variação estética → vira ocasião, segmento ou tag.
- **Limite recomendado:** 8–14 categorias raiz. Acima disso → considerar subcategorias ou unificação.

### 1.2 OCCASION — "para qual momento o produto serve"
- **Pergunta:** _qual evento, ritual ou momento de vida motiva a compra?_
- **Exemplos válidos:** Maternidade, Batizado, Casamento, Aniversário, Chá Revelação, Corporativo
- **Características:** contextual, comercial, base de landing pages temáticas e SEO long-tail.
- **Limite por produto:** **máx. 3 ocasiões**. Acima disso → over-tagging, dilui relevância.
- **Critérios para existir:**
  - ≥ 4 produtos genuinamente alinhados
  - termo usado pelo público (não apenas pela equipe)
  - distinção semântica de outras ocasiões (sem sinonímia)
- **NÃO criar quando:**
  - for uma sub-variação de outra ocasião (ex.: "casamento na praia" → tag, não ocasião)
  - tiver < 4 produtos sem previsão de crescimento
  - canibalizar uma ocasião irmã (ex.: "festa infantil" vs "aniversário infantil")
- **Casos ambíguos resolvidos:**
  - **Corporativo** → SEGMENTO (modelo comercial, não momento)
  - **Revelação** → OCASIÃO (chá-revelação é evento)
  - **Kits** → SEGMENTO (formato comercial)
  - **Personalizado** → TAG (faceta do produto)

### 1.3 SEGMENT — "para qual linha comercial / público"
- **Pergunta:** _a que modelo de negócio ou linha o produto pertence?_
- **Exemplos válidos:** Lembrancinhas, Brindes Corporativos, Kits & Combos, Pronta Entrega
- **Características:** transversal, opcional, organiza vitrines e coleções; **não** substitui categoria.
- **Diferença vs ocasião:** segmento é estável e comercial; ocasião é contextual e temática.
- **Diferença vs categoria:** segmento atravessa várias categorias (um kit pode ter sabonete + vela).
- **Diferença vs tag:** segmento estrutura uma vitrine/seção; tag é faceta de filtro.
- **Limite recomendado:** 3–6 segmentos. Cada um deve representar uma decisão de compra distinta.
- **NÃO criar quando:** o conceito for um nicho passageiro, sazonal ou de campanha → vira landing page temporária.

### 1.4 TAG — "qual faceta secundária o produto tem"
- **Pergunta:** _que atributo descritivo ajuda a filtrar/buscar?_
- **Exemplos válidos:** Floral, Minimalista, Delicado, Infantil, Luxo, Safari, Aromático, Personalizado
- **Características:** auxiliar, alta especificidade, base de filtros e busca; **nunca** vira vitrine de menu principal.
- **Regras rígidas:**
  - **Nunca** indexar tag isolada com < 8 produtos
  - **Nunca** criar tag sinônima ("delicado" vs "delicada" vs "delicate")
  - **Nunca** transformar tag em categoria oculta (anti-padrão clássico)
- **Limite por produto:** 5–8 tags. Acima disso → ruído, dilui relevância.

---

## 2. MATRIZ DE DECISÃO

| Conceito           | Categoria | Ocasião | Segmento | Tag | Motivo estratégico                                                  |
|--------------------|:---------:|:-------:|:--------:|:---:|---------------------------------------------------------------------|
| Sabonete           |     ✅    |    —    |    —     |  —  | Tipo de produto físico — taxonomia raiz                             |
| Vela               |     ✅    |    —    |    —     |  —  | Tipo de produto físico                                              |
| Maternidade        |     —     |    ✅   |    —     |  —  | Momento de vida — gera landing temática                             |
| Batizado           |     —     |    ✅   |    —     |  —  | Evento religioso                                                    |
| Casamento          |     —     |    ✅   |    —     |  —  | Evento — alta sazonalidade comercial                                |
| Corporativo        |     —     |    —    |    ✅    |  —  | Linha comercial B2B, atravessa categorias                           |
| Lembrancinhas      |     —     |    —    |    ✅    |  —  | Segmento comercial principal da loja                                |
| Kits & Combos      |     —     |    —    |    ✅    |  —  | Formato de venda                                                    |
| Pronta entrega     |     —     |    —    |    ✅    |  —  | Modelo de fulfillment                                               |
| Floral             |     —     |    —    |    —     | ✅  | Estética visual — filtro                                            |
| Minimalista        |     —     |    —    |    —     | ✅  | Estética — filtro                                                   |
| Safari (tema)      |     —     |    —    |    —     | ✅  | Tema decorativo — não evento                                        |
| Ursinho (tema)     |     —     |    —    |    —     | ✅  | Tema decorativo — risco de over-categorização                       |
| Luxo               |     —     |    —    |    —     | ✅  | Posicionamento — filtro                                             |
| Personalizado      |     —     |    —    |    —     | ✅  | Faceta de customização                                              |

**Regra cruzada:** se um conceito couber em mais de uma coluna, **escolha sempre a coluna mais à esquerda** (categoria > ocasião > segmento > tag). Isso preserva clareza estrutural e evita canibalização.

---

## 3. REGRAS DE GOVERNANÇA

### 3.1 Antes de criar QUALQUER taxonomia
- [ ] Já existe conceito equivalente (sinônimo, plural, variação)?
- [ ] Vai canibalizar uma página existente?
- [ ] Atende ao volume mínimo (ver 3.5)?
- [ ] Tem intenção de busca real OU valor comercial claro?
- [ ] Melhora UX, SEO **e** operação?
- [ ] Está na coluna correta da Matriz de Decisão?

Se qualquer resposta for "não" → **não criar**.

### 3.2 Naming
- Idioma: PT-BR
- Capitalização: Title Case ("Brindes Corporativos")
- Acentuação: obrigatória ("Ocasiões", "Bebês")
- Singular vs plural:
  - Categoria: singular ("Sabonete")
  - Ocasião: singular ("Casamento")
  - Segmento: plural quando coletivo ("Lembrancinhas", "Brindes Corporativos")
  - Tag: singular ("Floral")
- Tamanho máximo: 30 caracteres
- **Proibido:** abreviações, ampersand desnecessário, emojis, números aleatórios

### 3.3 Slugs
- Únicos no escopo global (a colisão histórica "lembrancinhas" tag vs segmento é caso a evitar permanentemente)
- `lowercase`, sem acentos, `-` como separador
- Sem stop-words desnecessárias ("de", "para")
- Mudança de slug → **obrigatório** registro em `redirects` (301)
- Reserva: slugs de categoria têm prioridade sobre slugs de tag/segmento

### 3.4 Indexação
| Estado                                      | Diretiva    |
|---------------------------------------------|-------------|
| Taxonomia com ≥ volume mínimo + conteúdo único | `index, follow` |
| Taxonomia sob volume mínimo                  | `noindex, follow` |
| Taxonomia vazia (0 produtos)                 | `noindex, nofollow` + esconder do menu |
| Combinação facetada (categoria + tag)        | `noindex` por padrão; whitelist manual para casos premium |

### 3.5 Volume mínimo para indexação
| Taxonomia  | Mínimo de produtos |
|------------|--------------------|
| Categoria  | 6                  |
| Ocasião    | 4                  |
| Segmento   | 4                  |
| Tag        | 8                  |

---

## 4. DIAGNÓSTICO DA ESTRUTURA ATUAL

> Resumo qualitativo (auditoria detalhada vive separadamente). Riscos priorizados.

### Manter
- Categorias raiz (Sabonete, Vela, etc.) — estáveis e bem dimensionadas
- Segmento "Lembrancinhas" como pilar comercial
- Estrutura de slugs amigáveis (já existe)

### Inconsistente / a observar
- Colisão histórica de slug entre **tag "lembrancinhas"** e **segmento "lembrancinhas"** — já resolvido em código, mas registrar como precedente.
- Algumas ocasiões com < 4 produtos — risco de thin page.
- Tags sinônimas potenciais a auditar (ex.: "delicado/delicada", variações de "personalizado").

### Ameaças de escalabilidade
- Crescimento de tags sem governança → inflação taxonômica
- Tendência de criar ocasião para cada tema decorativo → canibalização
- Combinações faceted indexadas sem critério → thin pages

---

## 5. PLANO DE ESCALABILIDADE

### Curto prazo (0–3 meses)
- Aplicar checklist anti-caos em **toda** criação nova
- Auditoria semestral de tags duplicadas/sinônimas
- Definir whitelist de combinações facetadas indexáveis

### Médio prazo (3–9 meses)
- Introduzir **subcategorias** quando uma categoria raiz passar de ~25 produtos com clara clivagem (ex.: "Sabonete > Glicerinado", "Sabonete > Esfoliante")
- Criar **hubs editoriais** para ocasiões campeãs (landing page enriquecida com guia + produtos + FAQ)
- Migrar campanhas sazonais para **landing pages temporárias** com `noindex` pós-evento

### Longo prazo (9+ meses)
- Knowledge graph entre categorias × ocasiões × tags alimentando o SEO OS
- Recomendações cross-taxonomia ("quem comprou para Maternidade também viu para Chá Revelação")
- Politica de **arquivamento** automática para taxonomias com 0 produtos por > 90 dias

---

## 6. ENTREGÁVEIS

### 6.A LEI DAS 4 TAXONOMIAS (resumo operacional)
1. **Categoria** = o que É → sempre escolha primeiro.
2. **Ocasião** = quando se USA → contextual, max 3 por produto.
3. **Segmento** = para QUEM/COMO se vende → comercial, transversal.
4. **Tag** = COMO é (faceta) → filtros, max 8 por produto.

### 6.B CHECKLIST ANTI-CAOS (use antes de cada criação)
- [ ] Coluna correta na Matriz de Decisão?
- [ ] Volume mínimo atendido (ver 3.5)?
- [ ] Sinônimo já existe?
- [ ] Slug único globalmente?
- [ ] Intenção de busca / valor comercial documentado?
- [ ] Naming segue 3.2?
- [ ] Plano de indexação definido?
- [ ] Não canibaliza nenhuma página existente?

### 6.C RISCOS ESTRUTURAIS ATUAIS (priorizados)
1. **Alto:** ocasiões com volume baixo gerando thin pages indexadas
2. **Alto:** falta de auditoria periódica de tags → inflação
3. **Médio:** combinações facetadas indexadas sem whitelist
4. **Médio:** risco de novas colisões de slug entre tag/segmento/ocasião
5. **Baixo:** ausência de subcategorias preparadas para categorias que crescerão

### 6.D RECOMENDAÇÕES POR HORIZONTE
- **Curto:** ativar checklist no admin (UI valida antes de salvar), revisar ocasiões com < 4 produtos.
- **Médio:** introduzir subcategorias e hubs editoriais; auditoria semestral.
- **Longo:** automatizar arquivamento, alimentar SEO OS com grafo taxonômico.

---

## OBJETIVO FINAL

A taxonomia da Empório LeleCute deve permanecer **simples, escalável, livre de fragmentação e de canibalização**, melhorando SEO, UX e conversão simultaneamente. Esta constituição é a referência permanente — toda decisão futura sobre criação, fusão, renomeação ou exclusão de taxonomia deve ser validada contra este documento.
