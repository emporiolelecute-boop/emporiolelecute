## Objetivo

Adicionar suavização visual nas trocas de slide do `HeroSlider` (mobile, tablet e desktop), incluindo o caso em que o layout muda entre tipos diferentes (banner mobile → texto+imagem, banner desktop → texto+imagem, banner → banner). Sem mexer na lógica de fetch, RLS, dados ou estrutura responsiva atual.

## Princípios

- Zero mudança de comportamento: mesmo autoplay (6s), mesmas setas, mesmos dots, mesmos componentes (`SlideTextImage`, `SlideBannerMobile`, `SlideBannerDesktop`).
- Apenas camada de apresentação: opacidade, leve translate, easing.
- Acessibilidade: respeitar `prefers-reduced-motion` (desativa animações).
- Sem libs novas — usar Tailwind/CSS keyframes já existentes (`fade-in`) + uma nova `slide-cross-fade`.

## Mudanças propostas

### 1. Cross-fade entre slides (todos os modos)
- Empilhar o slide ativo e o anterior em posição absoluta dentro de um wrapper `relative` com altura controlada pelo slide ativo.
- Slide que entra: opacidade 0→1 + leve `translateY(8px)→0` em ~500ms `ease-out`.
- Slide que sai: opacidade 1→0 em ~400ms, removido do DOM ao terminar.
- Resultado: a troca 2→3 (banner mobile → texto+imagem) deixa de ser "salto" e vira esmaecimento.

### 2. Altura fluida do container
- Wrapper mede a altura do slide ativo via `ResizeObserver` e anima `height` com `transition-[height] duration-500 ease-out`.
- Evita "pulo" quando o próximo slide tem altura diferente (banner curto vs. texto+imagem alto).

### 3. Imagens com fade-in ao carregar
- Adicionar `onLoad` nas `<img>` dos banners para aplicar `opacity-0 → opacity-100` (300ms) — evita flash quando o navegador troca a imagem responsiva.

### 4. Dots e setas
- Indicador de dot ativo com `transition-all duration-500 ease-out` (já existe, manter).
- Setas: pequeno `active:scale-95` para feedback tátil (opcional).

### 5. Reduced motion
- Wrap das animações em `motion-safe:` (Tailwind) e fallback estático em `motion-reduce:`.

### 6. Telemetria leve (opcional, desligado por padrão)
- Não adicionar nada novo agora; manter `telemetry.ts` existente.

## Arquivos afetados

- `src/components/HeroSlider.tsx` — único arquivo alterado.
  - Introduz wrapper com posicionamento absoluto + estado `prevSlideIndex` para cross-fade.
  - Adiciona `ResizeObserver` para altura animada.
  - Adiciona classes `motion-safe:animate-fade-in`, `transition-opacity duration-500`.
- `tailwind.config.ts` — adicionar 1 keyframe `slide-cross-fade` (opcional; pode reutilizar `fade-in` existente).

## Não será alterado

- `useHeroSlides`, RLS, queries, `image_mobile_url`/`image_desktop_url`, fallback, ordem dos slides, tempo de autoplay, breakpoints CSS (`block md:hidden` / `hidden md:block`), TrustBadges.

## Riscos & mitigação

- Risco: posicionamento absoluto pode "esconder" conteúdo se altura medida atrasar. Mitigação: medir `scrollHeight` síncrono no primeiro render via `useLayoutEffect` e definir altura mínima `min-h-[280px] md:min-h-[420px]`.
- Risco: imagens grandes do desktop carregando depois das do mobile. Mitigação: manter `fetchpriority="high"` no slide 0 e `loading="eager"` nele.
- Sem mudanças de schema, sem migração, sem mudança de hook.

## Validação

- Visual: navegar `/` em 375px, 768px, 1280px e observar transição 1→2→3→1.
- Console: sem warnings novos; nenhum erro de hidratação.
- `prefers-reduced-motion: reduce` — slides trocam instantaneamente sem animação.

Confirma para eu implementar?
