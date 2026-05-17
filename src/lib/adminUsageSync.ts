/**
 * Admin Usage Sync — Camada 2 + 3 da telemetria (P2.4).
 *
 * Camada 1 (local, em adminUsage.ts) permanece intocada.
 * Esta camada apenas:
 *   - extrai um payload AGREGADO (nada bruto, nada de input do usuário);
 *   - opcionalmente envia para o endpoint `admin-usage-ingest`;
 *   - é DESLIGADA por padrão (ENABLE_GLOBAL_USAGE = false).
 *
 * Falha de rede nunca afeta UX: fire-and-forget + retry leve + fallback silencioso.
 */

import { supabase } from '@/integrations/supabase/client';
import { getUsageAggregates, type UsageAggregates } from '@/lib/adminUsage';

/**
 * Flag global de telemetria.
 * P2.6: ativada para validação em produção contínua.
 * Comportamento local (localStorage + /admin/uso) permanece a fonte primária — falha de sync nunca afeta UX.
 */
export const ENABLE_GLOBAL_USAGE = true;

/** Ativa logs verbosos somente em DEV (Vite). */
const DEV =
  typeof import.meta !== 'undefined' &&
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;

interface SyncStats {
  attempts: number;
  successes: number;
  failures: number;
  lastPayloadBytes: number;
  lastLatencyMs: number;
}
const stats: SyncStats = { attempts: 0, successes: 0, failures: 0, lastPayloadBytes: 0, lastLatencyMs: 0 };
export function getSyncStats(): SyncStats {
  return { ...stats };
}

const SESSION_KEY = 'admin_usage_session_v1';
const LAST_SYNC_KEY = 'admin_usage_last_sync_v1';
const MIN_SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 min throttle

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/** Hash anônimo de sessão por navegador (não associado a usuário). */
function getSessionId(): string {
  if (!isBrowser()) return 'ssr';
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      const rand = crypto.getRandomValues(new Uint8Array(8));
      id = Array.from(rand, (b) => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

/** Payload enviado — apenas agregados, nada bruto. */
export interface UsageAggregatePayload {
  sessionId: string;
  version: 'p2.4';
  clientTs: number;
  totalEvents: number;
  aggregates: Omit<UsageAggregates, 'startedAt' | 'totalEvents'>;
}

/**
 * Constrói o payload a partir dos agregados locais.
 * Garante que NENHUM dado bruto, input de usuário ou conteúdo de produto seja embarcado.
 */
export function exportAggregates(): UsageAggregatePayload {
  const a = getUsageAggregates();
  const { startedAt: _startedAt, totalEvents, ...rest } = a;
  return {
    sessionId: getSessionId(),
    version: 'p2.4',
    clientTs: Date.now(),
    totalEvents,
    aggregates: rest,
  };
}

async function postWithRetry(payload: UsageAggregatePayload, attempt = 0): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('admin-usage-ingest', {
      body: payload,
    });
    if (!error) return true;
    if (attempt >= 1) return false;
    await new Promise((r) => setTimeout(r, 1500));
    return postWithRetry(payload, attempt + 1);
  } catch {
    if (attempt >= 1) return false;
    await new Promise((r) => setTimeout(r, 1500));
    return postWithRetry(payload, attempt + 1);
  }
}

/**
 * Envia agregados — fire-and-forget. Nunca lança. Throttled.
 * Retorna `true` apenas se o envio foi tentado (não necessariamente bem-sucedido).
 */
export function sendUsageBatch(force = false): boolean {
  if (!ENABLE_GLOBAL_USAGE) return false;
  if (!isBrowser()) return false;
  try {
    if (!force) {
      const last = Number(localStorage.getItem(LAST_SYNC_KEY) ?? 0);
      if (Date.now() - last < MIN_SYNC_INTERVAL_MS) return false;
    }
    localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
  const payload = exportAggregates();
  // fire-and-forget; never blocks UX
  void postWithRetry(payload).catch(() => {});
  return true;
}

/** Debug surface (somente quando habilitado). */
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__adminUsageSync = {
    enabled: ENABLE_GLOBAL_USAGE,
    exportAggregates,
    sendUsageBatch,
  };
}
