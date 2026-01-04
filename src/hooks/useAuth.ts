import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      // Prefer server-side role check (SECURITY DEFINER), avoids any RLS/policy edge cases
      const { data: hasAdminRole, error: rpcError } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin',
      });

      if (rpcError) {
        console.error('Error checking admin role (rpc):', rpcError);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(!!hasAdminRole);
    } finally {
      // Ensure we always mark the role check as completed
      setAdminChecked(true);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);

        if (session?.user) {
          // Reset role check and re-check
          setAdminChecked(false);
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);

      if (session?.user) {
        setAdminChecked(false);
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setAdminChecked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  // Treat as loading while we still haven't determined the role for a logged-in user.
  const loading = authLoading || (!!user && !adminChecked);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminChecked,
    signIn,
    signUp,
    signOut,
  };
}

