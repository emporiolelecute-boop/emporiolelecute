import { useEffect, useRef } from 'react';
import { trackAdminEvent } from '@/lib/adminUsage';

/**
 * Tracks form lifecycle for usage analytics.
 *
 * Emits:
 *   - form_open on mount
 *   - form_abandon on unmount if no submission happened
 *
 * `markSubmitted()` should be called on successful submit.
 * Never receives or stores input data.
 */
export function useFormUsageTracking(formKey: string) {
  const submittedRef = useRef(false);

  useEffect(() => {
    trackAdminEvent('form_open', formKey);
    return () => {
      if (!submittedRef.current) {
        trackAdminEvent('form_abandon', formKey);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    markSubmitted() {
      if (!submittedRef.current) {
        submittedRef.current = true;
        trackAdminEvent('form_submit', formKey);
      }
    },
  };
}
