

## Análise da Situação Atual

**Rota `/loja`**: Não existe como página dedicada. Atualmente é capturada pela rota dinâmica `/:slug` (DynamicPage), que busca uma página no banco de dados pelo slug "loja". Se não existir no banco, mostra "Página não encontrada". Ou seja, está vazia.

**Erro de build**: `useDebounce.ts` usa `NodeJS.Timeout` que não existe no browser — precisa ser `ReturnType<typeof setTimeout>`.

---

## Plano de Implementação

### 1. Corrigir erro de build (useDebounce.ts)
Trocar `NodeJS.Timeout` por `ReturnType<typeof setTimeout>` na linha 30.

### 2. Criar Landing Page `/loja` para Google Ads

Criar uma página dedicada `src/pages/Loja.tsx` com rota explícita `/loja` (antes da rota dinâmica `/:slug`).

**Estrutura da landing page (otimizada para conversão):**

```text
┌─────────────────────────────────────┐
│  Header (existente)                 │
├─────────────────────────────────────┤
│  HERO COMPACTO                      │
│  - Logo + tagline da marca          │
│  - CTA principal → WhatsApp         │
│  - Badges: "Feito à mão" etc.      │
├─────────────────────────────────────┤
│  PRODUTOS EM DESTAQUE (4-8)         │
│  - Grid responsivo                  │
│  - ProductCard existente            │
│  - Produtos com melhor rating/badge │
├─────────────────────────────────────┤
│  DIFERENCIAIS / PROVA SOCIAL        │
│  - 3-4 ícones com benefícios        │
│  - Depoimentos (reuso componente)   │
├─────────────────────────────────────┤
│  CTA FINAL                          │
│  - Botão WhatsApp grande            │
│  - "Peça seu orçamento"             │
├─────────────────────────────────────┤
│  Footer (existente)                 │
└─────────────────────────────────────┘
```

**Características técnicas:**
- Componentes existentes reutilizados (ProductCard, Header, Footer, WhatsAppButton)
- Sem scripts desnecessários — página leve
- SEO: DynamicSEO com título/descrição otimizados para ads
- Schema.org: BreadcrumbStructuredData + ItemListStructuredData
- Mobile-first, carregamento rápido
- Lazy loaded como todas as outras páginas
- Nenhuma alteração em páginas existentes

### 3. Registrar rota no App.tsx
Adicionar `/loja` como rota explícita antes da rota `/:slug`.

