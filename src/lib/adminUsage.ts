/**
 * Admin Usage Telemetry — client-side only, privacy-preserving.
 *
 * - Stores a capped ring buffer of admin events in localStorage.
 * - Never captures input values, product data, or PII.
 * - Used to answer: what does the operator actually use vs what is just structurally present?
 *
 * Storage:
 *   key: 'admin_usage_v1'
 *   shape: { events: AdminUsageEvent[], startedAt: number }
 */

export type AdminUsageEventType =
  | 'page_view'
  | 'page_leave' // dwell time recorded
  | 'nav_click'
  | 'form_open'
  | 'form_submit'
  | 'form_abandon'
  | 'list_search'
  | 'list_filter'
  | 'list_item_click'
  | 'slug_invalid_attempt'
  | 'slug_generation_blocked'
  | 'slug_quality_warning';

export interface AdminUsageEvent {
  /** event type */
  t: AdminUsageEventType;
  /** target identifier (route, form name, nav label, list name). NEVER contains user data. */
  k: string;
  /** ms timestamp */
  ts: number;
  /** optional numeric value (e.g. dwell ms) */
  v?: number;
}

const STORAGE_KEY = 'admin_usage_v1';
const MAX_EVENTS = 2000; // hard cap; oldest dropped when exceeded
const FLUSH_DEBOUNCE = 1500;

interface Store {
  events: AdminUsageEvent[];
  startedAt: number;
}

let memory: Store | null = null;
let flushTimer: number | null = null;
let disabled = false;

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function load(): Store {
  if (memory) return memory;
  if (!isBrowser()) {
    memory = { events: [], startedAt: Date.now() };
    return memory;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (parsed && Array.isArray(parsed.events)) {
        memory = parsed;
        return memory;
      }
    }
  } catch {
    // ignore corrupted state
  }
  memory = { events: [], startedAt: Date.now() };
  return memory;
}

function scheduleFlush() {
  if (!isBrowser()) return;
  if (flushTimer != null) window.clearTimeout(flushTimer);
  flushTimer = window.setTimeout(() => {
    try {
      if (memory) localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch {
      // quota or privacy mode — silently degrade
      disabled = true;
    }
    flushTimer = null;
  }, FLUSH_DEBOUNCE);
}

/** Sanitize a target key — defensive cap, no input content allowed. */
function sanitizeKey(k: string): string {
  if (!k) return '?';
  // 80 chars hard limit; strip newlines and excess whitespace.
  return String(k).replace(/\s+/g, ' ').trim().slice(0, 80);
}

export function trackAdminEvent(type: AdminUsageEventType, key: string, value?: number) {
  if (disabled || !isBrowser()) return;
  const store = load();
  store.events.push({ t: type, k: sanitizeKey(key), ts: Date.now(), v: value });
  if (store.events.length > MAX_EVENTS) {
    store.events.splice(0, store.events.length - MAX_EVENTS);
  }
  scheduleFlush();
}

export interface UsageAggregates {
  startedAt: number;
  totalEvents: number;
  pageViews: Record<string, number>;
  avgDwellMs: Record<string, number>;
  navClicks: Record<string, number>;
  forms: Record<string, { opened: number; submitted: number; abandoned: number; submitRate: number }>;
  listSearches: Record<string, number>;
  listItemClicks: Record<string, number>;
  slugInvalidAttempts: Record<string, number>;
}

export function getUsageAggregates(): UsageAggregates {
  const store = load();
  const pageViews: Record<string, number> = {};
  const dwellSum: Record<string, number> = {};
  const dwellCount: Record<string, number> = {};
  const navClicks: Record<string, number> = {};
  const formStats: Record<string, { opened: number; submitted: number; abandoned: number }> = {};
  const listSearches: Record<string, number> = {};
  const listItemClicks: Record<string, number> = {};
  const slugInvalidAttempts: Record<string, number> = {};

  const ensureForm = (k: string) => {
    if (!formStats[k]) formStats[k] = { opened: 0, submitted: 0, abandoned: 0 };
    return formStats[k];
  };

  for (const e of store.events) {
    switch (e.t) {
      case 'page_view':
        pageViews[e.k] = (pageViews[e.k] || 0) + 1;
        break;
      case 'page_leave':
        if (typeof e.v === 'number' && e.v > 0) {
          dwellSum[e.k] = (dwellSum[e.k] || 0) + e.v;
          dwellCount[e.k] = (dwellCount[e.k] || 0) + 1;
        }
        break;
      case 'nav_click':
        navClicks[e.k] = (navClicks[e.k] || 0) + 1;
        break;
      case 'form_open':
        ensureForm(e.k).opened += 1;
        break;
      case 'form_submit':
        ensureForm(e.k).submitted += 1;
        break;
      case 'form_abandon':
        ensureForm(e.k).abandoned += 1;
        break;
      case 'list_search':
      case 'list_filter':
        listSearches[e.k] = (listSearches[e.k] || 0) + 1;
        break;
      case 'list_item_click':
        listItemClicks[e.k] = (listItemClicks[e.k] || 0) + 1;
        break;
      case 'slug_invalid_attempt':
        slugInvalidAttempts[e.k] = (slugInvalidAttempts[e.k] || 0) + 1;
        break;
    }
  }

  const avgDwellMs: Record<string, number> = {};
  for (const k of Object.keys(dwellSum)) {
    avgDwellMs[k] = Math.round(dwellSum[k] / Math.max(1, dwellCount[k]));
  }

  const forms: UsageAggregates['forms'] = {};
  for (const [k, s] of Object.entries(formStats)) {
    const denom = s.opened || s.submitted + s.abandoned || 1;
    forms[k] = {
      ...s,
      submitRate: Math.round((s.submitted / denom) * 100),
    };
  }

  return {
    startedAt: store.startedAt,
    totalEvents: store.events.length,
    pageViews,
    avgDwellMs,
    navClicks,
    forms,
    listSearches,
    listItemClicks,
    slugInvalidAttempts,
  };
}

export function exportUsageEvents(): AdminUsageEvent[] {
  return load().events.slice();
}

export function resetUsage() {
  memory = { events: [], startedAt: Date.now() };
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    } catch {
      /* ignore */
    }
  }
}

// Expose a tiny debug surface — never used in production code paths.
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__adminUsage = {
    track: trackAdminEvent,
    aggregates: getUsageAggregates,
    events: exportUsageEvents,
    reset: resetUsage,
  };
}
