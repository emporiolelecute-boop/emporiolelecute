import { Component, ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logClientError } from "@/lib/telemetry";

interface State {
  err: Error | null;
}

export default class RootErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    void logClientError({
      source: "react-boundary",
      message: err.message || "React render error",
      stack: err.stack,
      componentStack: info.componentStack || undefined,
    });
  }

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-xl font-display">Algo deu errado</h2>
          <p className="text-sm text-muted-foreground break-words">
            {this.state.err.message || "Erro inesperado."}
          </p>
          <p className="text-xs text-muted-foreground">
            O erro foi registrado. Tente recarregar a página.
          </p>
          <Button onClick={() => location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Recarregar
          </Button>
        </div>
      </div>
    );
  }
}
