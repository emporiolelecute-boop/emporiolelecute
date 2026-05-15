import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';

const ROLE_CACHE_PREFIX = 'auth_role_v1:';
// Short TTL so a freshly revoked admin loses access within ~60s of any
// navigation, even before the tab is closed (which clears sessionStorage).
const ROLE_CACHE_TTL_MS = 60_000;

interface RoleCache {
  isAdmin: boolean;
  cachedAt: number;
}

function readRoleCache(userId: string): RoleCache | null {
  try {
    const raw = sessionStorage.getItem(ROLE_CACHE_PREFIX + userId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoleCache;
    if (!parsed || typeof parsed.cachedAt !== 'number') return null;
    if (Date.now() - parsed.cachedAt > ROLE_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRoleCache(userId: string, isAdmin: boolean) {
  try {
    const payload: RoleCache = { isAdmin, cachedAt: Date.now() };
    sessionStorage.setItem(ROLE_CACHE_PREFIX + userId, JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
}

function clearAllRoleCache() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(ROLE_CACHE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [roleRefreshing, setRoleRefreshing] = useState(false);
  const lastUserIdRef = useRef<string | null>(null);

  const fetchRoleFromServer = useCallback(async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });
    if (error) {
      console.error('Error checking admin role (rpc):', error);
      return false;
    }
    return !!data;
  }, []);

  const applyRoleForUser = useCallback(
    async (userId: string, opts: { useCache?: boolean } = {}) => {
      const useCache = opts.useCache !== false;
      // Hydrate from sessionStorage instantly when allowed
      if (useCache) {
        const cached = readRoleCache(userId);
        if (cached) {
          setIsAdmin(cached.isAdmin);
          setAdminChecked(true);
          // Background revalidate (without blocking UI) to catch revocations
          void (async () => {
            const fresh = await fetchRoleFromServer(userId);
            if (lastUserIdRef.current !== userId) return;
            if (fresh !== cached.isAdmin) {
              setIsAdmin(fresh);
            }
            writeRoleCache(userId, fresh);
          })();
          return cached.isAdmin;
        }
      }
      const fresh = await fetchRoleFromServer(userId);
      if (lastUserIdRef.current !== userId) return fresh;
      setIsAdmin(fresh);
      setAdminChecked(true);
      writeRoleCache(userId, fresh);
      return fresh;
    },
    [fetchRoleFromServer],
  );

  /**
   * Force-refresh the cached role (e.g. after a successful self-promotion or
   * after we suspect revocation). Returns the freshly-fetched value.
   */
  const refreshRole = useCallback(async (): Promise<boolean> => {
    const uid = lastUserIdRef.current;
    if (!uid) return false;
    setRoleRefreshing(true);
    try {
      // Bypass cache, hit the server, then rewrite cache
      const fresh = await fetchRoleFromServer(uid);
      if (lastUserIdRef.current !== uid) return fresh;
      setIsAdmin(fresh);
      setAdminChecked(true);
      writeRoleCache(uid, fresh);
      return fresh;
    } finally {
      setRoleRefreshing(false);
    }
  }, [fetchRoleFromServer]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setAuthLoading(false);

        // Sign-out / user-switch: hard-flush cached roles
        if (event === 'SIGNED_OUT') {
          clearAllRoleCache();
          lastUserIdRef.current = null;
          setIsAdmin(false);
          setAdminChecked(true);
          return;
        }

        const uid = newSession?.user?.id ?? null;
        if (!uid) {
          lastUserIdRef.current = null;
          setIsAdmin(false);
          setAdminChecked(true);
          return;
        }

        // User switched: invalidate any prior user's cache for safety
        if (lastUserIdRef.current && lastUserIdRef.current !== uid) {
          clearAllRoleCache();
        }
        lastUserIdRef.current = uid;
        setAdminChecked(false);
        // Defer to avoid running RPC inside the auth callback
        setTimeout(() => {
          // After a token refresh, force a server check (revocation may have
          // happened); on initial sign-in trust the cache for instant UX.
          const useCache = event !== 'TOKEN_REFRESHED';
          void applyRoleForUser(uid, { useCache });
        }, 0);
      },
    );

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      setAuthLoading(false);
      const uid = existing?.user?.id ?? null;
      if (uid) {
        lastUserIdRef.current = uid;
        setAdminChecked(false);
        void applyRoleForUser(uid, { useCache: true });
      } else {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [applyRoleForUser]);

  const loading = authLoading || (!!user && !adminChecked);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { full_name: fullName } },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: `${window.location.origin}/admin/login`,
    });
    if (result.error) return { error: result.error };
    return { error: null };
  };

  const signOut = async () => {
    clearAllRoleCache();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminChecked,
    roleRefreshing,
    refreshRole,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
