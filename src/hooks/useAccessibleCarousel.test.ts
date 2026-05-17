import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAccessibleCarousel } from "./useAccessibleCarousel";

/**
 * Build a fake scroller DOM with N items spaced `itemW` apart.
 * Each item lives at offsetLeft = i * itemW.
 */
function setupDom(total: number, itemW = 100, viewport = 300) {
  const scroller = document.createElement("div");
  Object.defineProperty(scroller, "clientWidth", { configurable: true, value: viewport });
  Object.defineProperty(scroller, "scrollWidth", { configurable: true, value: itemW * total });
  scroller.scrollLeft = 0;
  scroller.scrollTo = vi.fn((opts: ScrollToOptions) => {
    scroller.scrollLeft = (opts as ScrollToOptions).left ?? 0;
  }) as unknown as typeof scroller.scrollTo;
  scroller.scrollBy = vi.fn(({ left }: ScrollToOptions) => {
    scroller.scrollLeft += (left as number) ?? 0;
  }) as unknown as typeof scroller.scrollBy;

  const items: HTMLElement[] = [];
  for (let i = 0; i < total; i++) {
    const el = document.createElement("a");
    Object.defineProperty(el, "offsetLeft", { configurable: true, value: i * itemW });
    Object.defineProperty(el, "offsetWidth", { configurable: true, value: itemW });
    el.focus = vi.fn();
    items.push(el);
  }
  return { scroller, items };
}

function attach(result: ReturnType<typeof renderHook<ReturnType<typeof useAccessibleCarousel>, unknown>>["result"], scroller: HTMLDivElement, items: HTMLElement[]) {
  (result.current.scrollerRef as React.MutableRefObject<HTMLDivElement | null>).current = scroller;
  (result.current.itemsRef as React.MutableRefObject<Array<HTMLElement | null>>).current = items;
}

function fireScroll(scroller: HTMLDivElement, left: number) {
  scroller.scrollLeft = left;
  scroller.dispatchEvent(new Event("scroll"));
}

beforeEach(() => {
  // Mock requestAnimationFrame for persistence to be synchronous-ish.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  localStorage.clear();
  sessionStorage.clear();
});

describe("useAccessibleCarousel", () => {
  it("does not flicker on micro-movements below 18px threshold", () => {
    const { result } = renderHook(() =>
      useAccessibleCarousel({ storageKey: "test:flicker", total: 5 })
    );
    const { scroller, items } = setupDom(5, 100, 300);
    attach(result, scroller as HTMLDivElement, items);

    // Center starts at scrollLeft 0 -> center=150 -> closest is item 1 (center 150).
    // But initial active is 0. A micro nudge of 10px should NOT switch.
    act(() => fireScroll(scroller as HTMLDivElement, 10));
    // active item (0) center=50, dist from center(160)=110
    // best item (1) center=150, dist=10. Diff=100 >> 18, so it WILL switch.
    // That's correct: a real big change. Now test the opposite — when distances are close.

    // Reset with viewport that places item 0 well-centered.
    const small = setupDom(5, 100, 100); // viewport 100, item 0 center=50
    attach(result, small.scroller as HTMLDivElement, small.items);
    act(() => fireScroll(small.scroller as HTMLDivElement, 0));
    const beforeIdx = result.current.activeIdx;

    // Micro scroll of 8px: item0 dist = |50-58|=8, item1 dist=|150-58|=92.
    // active stays 0, no switch.
    act(() => fireScroll(small.scroller as HTMLDivElement, 8));
    expect(result.current.activeIdx).toBe(beforeIdx);

    // Scroll to 45 — center=95. item0 dist=45, item1 dist=55.
    // Candidate is item0 (already active), no switch.
    act(() => fireScroll(small.scroller as HTMLDivElement, 45));
    expect(result.current.activeIdx).toBe(0);

    // Scroll to 60 — center=110. item0 dist=60, item1 dist=40.
    // diff = 60-40 = 20 > 18 -> SWITCH to item 1.
    act(() => fireScroll(small.scroller as HTMLDivElement, 60));
    expect(result.current.activeIdx).toBe(1);
  });

  it("does NOT switch when candidate is only marginally closer (<18px gap)", () => {
    const { result } = renderHook(() =>
      useAccessibleCarousel({ storageKey: "test:gap", total: 3 })
    );
    const { scroller, items } = setupDom(3, 100, 100);
    attach(result, scroller as HTMLDivElement, items);

    act(() => fireScroll(scroller as HTMLDivElement, 0));
    expect(result.current.activeIdx).toBe(0);

    // Scroll to 55 -> center=105. item0 dist=55, item1 dist=45.
    // diff = 10 < 18 -> stay on 0.
    act(() => fireScroll(scroller as HTMLDivElement, 55));
    expect(result.current.activeIdx).toBe(0);

    // Scroll to 68 -> center=118. item0 dist=68, item1 dist=32.
    // diff = 36 > 18 -> switch.
    act(() => fireScroll(scroller as HTMLDivElement, 68));
    expect(result.current.activeIdx).toBe(1);
  });

  it("respects custom activeSwitchThreshold", () => {
    const { result } = renderHook(() =>
      useAccessibleCarousel({ storageKey: "test:custom", total: 3, activeSwitchThreshold: 40 })
    );
    const { scroller, items } = setupDom(3, 100, 100);
    attach(result, scroller as HTMLDivElement, items);

    act(() => fireScroll(scroller as HTMLDivElement, 0));
    // diff of 20 should be ignored when threshold=40
    act(() => fireScroll(scroller as HTMLDivElement, 60));
    expect(result.current.activeIdx).toBe(0);
  });

  it("keyboard arrows move active index with bounds", () => {
    const { result } = renderHook(() =>
      useAccessibleCarousel({ storageKey: "test:kb", total: 4 })
    );
    const { scroller, items } = setupDom(4, 100, 100);
    attach(result, scroller as HTMLDivElement, items);

    const press = (key: string) => {
      act(() => {
        result.current.onKeyDown({
          key,
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLDivElement>);
      });
    };

    press("ArrowRight");
    expect(result.current.activeIdx).toBe(1);
    press("End");
    expect(result.current.activeIdx).toBe(3);
    press("ArrowRight"); // clamped
    expect(result.current.activeIdx).toBe(3);
    press("ArrowLeft");
    expect(result.current.activeIdx).toBe(2);
    press("Home");
    expect(result.current.activeIdx).toBe(0);
    press("ArrowLeft"); // clamped
    expect(result.current.activeIdx).toBe(0);
  });

  it("scrollBy delegates to the scroller", () => {
    const { result } = renderHook(() =>
      useAccessibleCarousel({ storageKey: "test:by", total: 4 })
    );
    const { scroller, items } = setupDom(4, 100, 300);
    attach(result, scroller as HTMLDivElement, items);
    act(() => result.current.scrollBy(1));
    expect(scroller.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: expect.any(Number), behavior: "smooth" })
    );
  });
});
