import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAdminEvent } from '@/lib/adminUsage';
import { sendUsageBatch } from '@/lib/adminUsageSync';

/**
 * Auto-tracks admin page views and dwell time per route.
 * Mount once in AdminLayout. Invisible to the user.
 */
export function useAdminPageTracking() {
  const location = useLocation();
  const enteredAtRef = useRef<number>(Date.now());
  const lastRouteRef = useRef<string>('');

  useEffect(() => {
    const route = location.pathname;
    const now = Date.now();

    // Emit dwell for previous route if any.
    if (lastRouteRef.current && lastRouteRef.current !== route) {
      const dwell = now - enteredAtRef.current;
      if (dwell > 250 && dwell < 6 * 60 * 60 * 1000) {
        trackAdminEvent('page_leave', lastRouteRef.current, dwell);
      }
    }

    trackAdminEvent('page_view', route);
    lastRouteRef.current = route;
    enteredAtRef.current = now;
    // Opportunistic global sync — throttled (≥5min) + fire-and-forget. Local UX is unaffected.
    sendUsageBatch();

    return () => {
      // On unmount (e.g., leaving admin entirely), flush dwell.
      if (lastRouteRef.current) {
        const dwell = Date.now() - enteredAtRef.current;
        if (dwell > 250 && dwell < 6 * 60 * 60 * 1000) {
          trackAdminEvent('page_leave', lastRouteRef.current, dwell);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Also flush dwell on tab close.
  useEffect(() => {
    const onHide = () => {
      if (lastRouteRef.current) {
        const dwell = Date.now() - enteredAtRef.current;
        if (dwell > 250 && dwell < 6 * 60 * 60 * 1000) {
          trackAdminEvent('page_leave', lastRouteRef.current, dwell);
        }
        enteredAtRef.current = Date.now();
      }
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') onHide();
    });
    return () => {
      window.removeEventListener('pagehide', onHide);
    };
  }, []);
}
