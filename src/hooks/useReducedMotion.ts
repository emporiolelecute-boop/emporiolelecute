import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "emporio:reduced-motion";

function systemPrefers(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readStored(): boolean | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "1") return true;
  if (v === "0") return false;
  return null;
}

/**
 * Reduced-motion controller.
 * - User toggle wins over system preference.
 * - Persists choice in localStorage.
 * - Applies `motion-reduced` class to <html> for CSS to react.
 */
export function useReducedMotion() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const stored = readStored();
    return stored !== null ? stored : systemPrefers();
  });

  // Reflect on <html> so global CSS can opt-out animations.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("motion-reduced", enabled);
  }, [enabled]);

  // Listen to system changes only when user has no explicit choice.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (readStored() === null) setEnabled(mq.matches);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setEnabled(systemPrefers());
  }, []);

  return { enabled, toggle, reset };
}
