import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logTelemetryEvent } from "@/lib/telemetry";

interface State {
  err: Error | null;
}

export default class AdminErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error) {
    try {
      void (supabase as any).from("stale_bundle_logs").insert({
        route: typeof location !== "undefined" ? location.pathname : "",
        message: `admin-error-boundary:${err.message}`.slice(0, 2000),
        stack: String(err.stack || "").slice(0, 8000),
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 1000) : "",
        reloaded: false,
      });
    } catch {
      /* best-effort */
    }
  }

  reset = () => this.setState({ err: null });

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-xl font-display">Algo deu errado neste painel</h2>
          <p className="text-sm text-muted-foreground break-words">
            {this.state.err.message || "Erro inesperado ao carregar a página."}
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Button variant="outline" onClick={() => history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
            </Button>
            <Button onClick={() => location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Recarregar
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
