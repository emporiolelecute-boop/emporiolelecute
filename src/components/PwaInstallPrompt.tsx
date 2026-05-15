import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

const VISIT_KEY = "pwa:visit-count";
const DISMISSED_KEY = "pwa:install-dismissed";
const INSTALLED_KEY = "pwa:installed";
const MIN_VISITS = 5;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Increment visit counter once per browser session.
    if (!sessionStorage.getItem("pwa:visit-counted")) {
      const prev = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) || 0;
      localStorage.setItem(VISIT_KEY, String(prev + 1));
      sessionStorage.setItem("pwa:visit-counted", "1");
    }

    if (localStorage.getItem(INSTALLED_KEY) === "1") return;
    if (localStorage.getItem(DISMISSED_KEY) === "1") return;

    const handler = (e: Event) => {
      e.preventDefault();
      const visits = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) || 0;
      setDeferred(e as BeforeInstallPromptEvent);
      if (visits >= MIN_VISITS) setVisible(true);
    };

    const installedHandler = () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (!visible || !deferred) return null;

  const onInstall = async () => {
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "1");
      } else {
        localStorage.setItem(DISMISSED_KEY, "1");
      }
    } catch {
      // ignore
    } finally {
      setVisible(false);
      setDeferred(null);
    }
  };

  const onDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-background border border-border rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground">Instalar app</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Adicione o Empório Lelecute à sua tela inicial para acesso rápido.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={onInstall} className="gap-1">
              <Download className="h-3 w-3" /> Instalar
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Agora não
            </Button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Fechar"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
