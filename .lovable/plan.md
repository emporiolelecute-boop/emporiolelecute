## Objetivo

1. Garantir que usuários com `prefers-reduced-motion: reduce` tenham troca de slides instantânea, sem flash, sem "piscar" e sem layout-shift.
2. Auditar o HeroSlider (cross-fade + ResizeObserver) para eliminar re-renders desnecessários e engasgos em mobile/desktop.
3. Apresentar um roadmap curto de melhorias adicionais (sem implementar agora).

---

## Parte A — Reduced Motion (implementar agora)

Hoje o HeroSlider usa classes `motion-safe:animate-fade-in` e `motion-safe:animate-fade-out`. Com `prefers-reduced-motion: reduce`, essas animações somem, mas:

- O slide ativo entra com `opacity-0` (classe base) e depende da animação para ficar visível → em `motion-reduce` ele fica **invisível**.
- A altura do stage (`transition-[height]`) também é `motion-safe`, então o "snap" de altura é aceitável, porém o slide anterior fica empilhado por 600ms causando sobreposição.

**Correções:**

1. Detectar `prefers-reduced-motion` via `useEffect` + `matchMedia('(prefers-reduced-motion: reduce)')` e guardar em estado `reducedMotion`.
2. Quando `reducedMotion === true`:
   - Não renderizar o slide anterior (`previous`) — troca instantânea.
   - Renderizar slide ativo com `opacity-100` direto (sem `opacity-0` inicial).
   - Stage com `height: 'auto'` (sem transição).
3. Quando `reducedMotion === false`: comportamento atual (cross-fade 500ms).
4. Garantir fallback CSS: a classe `motion-reduce:opacity-100` já existe no ativo, mas remover o `opacity-0` base condicionalmente para evitar qualquer flash em navegadores que processam `motion-reduce` com atraso.

**Validação:**
- Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" → trocar slides 1→2→3 → conteúdo aparece imediatamente, sem fade, sem invisibilidade.
- Sem `motion-reduce`: cross-fade continua suave.

---

## Parte B — Auditoria de performance

**Riscos atuais identificados na leitura de `HeroSlider.tsx`:**

1. `ResizeObserver` re-cria a cada `currentSlide` ou `slides.length` mudar (deps do `useLayoutEffect`). Em troca de slide, observer é desconectado e recriado — desperdício.
2. `setStageHeight(el.offsetHeight)` dispara re-render a cada frame de animação de imagem carregando → potencial loop.
3. `SlideRenderer` renderiza **tanto** mobile quanto desktop ao mesmo tempo (controlados por `block md:hidden` / `hidden md:block`). Isso é correto para evitar flash em resize, mas o slide anterior **também** renderiza ambos — temos até 4 imagens montadas simultaneamente durante o cross-fade.
4. `window.addEventListener('resize', measure)` sem debounce.
5. Função `goTo` recriada a cada render (não memoizada) — passada para `onClick` dos dots.

**Correções:**

1. **Observer estável**: mover `ResizeObserver` para um `useLayoutEffect` com deps `[]`, observar `stageRef.current` (wrapper) ao invés de `activeRef.current`. Quando o slide ativo trocar, o wrapper já reflete a nova altura via re-render.
2. **Debounce de medição**: usar `requestAnimationFrame` para coalescer múltiplas chamadas de `measure` no mesmo frame.
3. **Evitar loop**: comparar `Math.round(el.offsetHeight)` com `stageHeight` antes de chamar `setStageHeight`.
4. **Imagens duplicadas no cross-fade**: aceitar como custo (necessário para fade), mas garantir que o slide anterior use `loading="lazy"` e `decoding="async"` (já está) e seja `aria-hidden` (já está). Adicionar `pointer-events-none` (já está).
5. **Debounce resize**: trocar `resize` listener por `ResizeObserver` no `<section>` raiz (já cobre resize de viewport quando o componente é responsivo) — eliminar listener de `window`.
6. **Memoizar callbacks**: `goTo`, `nextSlideFn`, `prevSlideFn` com `useCallback`.
7. **Memoizar `slides` derivado**: o array vem do hook; só comparar referência.

**Validação:**
- DevTools Performance → gravar 10s navegando entre slides → verificar se há long tasks > 50ms.
- React DevTools Profiler → trocar slide → confirmar que apenas `HeroSlider` re-renderiza, não pais.

---

## Parte C — Roadmap de melhorias futuras (não implementar agora, para sua aprovação posterior)

1. **Pré-carregar próximo slide**: `<link rel="prefetch">` para imagem do próximo slide quando o atual ficar visível há 3s.
2. **Pause-on-hover / pause-on-focus**: pausar autoplay quando mouse sobre o slider ou quando dot recebe foco (acessibilidade WAI-ARIA Carousel pattern).
3. **Swipe gestures no mobile**: arrastar para trocar slide (touch events nativos, sem lib).
4. **Indicador de progresso**: barra fina abaixo dos dots mostrando o tempo até a próxima troca (visual delicado, suave).
5. **Lazy mount de slides distantes**: renderizar só os 2 slides "vizinhos" do atual (mais 1 anterior + 1 próximo), reduzindo DOM.
6. **Preload inteligente da imagem desktop vs mobile**: usar `<picture>` com `<source media>` ao invés de renderizar dois `<img>` (`block md:hidden` / `hidden md:block`) — economiza 1 download por slide.
7. **Telemetria opcional**: registrar quantos usuários usam setas vs dots vs autoplay (orienta UX).
8. **Animação direcional**: ao clicar "próximo", slide entra da direita; ao clicar "anterior", da esquerda (atualmente é cross-fade puro).
9. **ARIA live region**: anunciar troca de slide para leitores de tela (`<div aria-live="polite">Slide 2 de 3</div>`).
10. **Pausar quando aba está oculta**: usar `document.visibilityState` para parar autoplay e economizar bateria.

---

## Arquivos afetados (Partes A e B)

- `src/components/HeroSlider.tsx` — único arquivo alterado.

## Não será alterado

- `useHeroSlides`, RLS, queries, estrutura de banner mobile/desktop, fallback, dots/setas, TrustBadges, autoplay (6s).

## Riscos & mitigação

- **Risco**: ao remover slide anterior em `reduced-motion`, pode haver "salto" de altura. Mitigação: stage com `height: auto` direto (sem transição) — comportamento esperado por quem solicita reduced-motion.
- **Risco**: `ResizeObserver` em wrapper com altura controlada por estado pode criar feedback loop. Mitigação: comparar valor antes do `setState` (item B.3).

---

**Confirma para eu implementar as Partes A e B?** O Roadmap (Parte C) fica para você escolher quais quer priorizar depois.
