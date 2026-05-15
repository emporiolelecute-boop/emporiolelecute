import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

/**
 * Route guard for /admin/*.
 * - While auth/role check is in flight: shows verification overlay (no flash of admin UI).
 * - Not logged in → /admin/login.
 * - Logged in, not admin → /acesso-restrito.
 * - Logged in admin → renders children.
 */
const RequireAdmin = ({ children }: Props) => {
  const { user, isAdmin, loading, adminChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/admin/login', { replace: true, state: { from: location.pathname } });
    } else if (adminChecked && !isAdmin) {
      navigate('/acesso-restrito', { replace: true });
    }
  }, [user, isAdmin, loading, adminChecked, navigate, location.pathname]);

  if (loading || !user || !adminChecked || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">Verificando permissões de acesso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
