// Sprint final — barra fixa de salvar para formulários admin longos.
// Mantém o CTA primário sempre visível e indica estado dirty / autosave.
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickySaveBarProps {
  dirty?: boolean;
  saving?: boolean;
  savedAt?: number | null;
  onSave: () => void;
  /** Label do botão. Default: "Salvar". */
  label?: string;
  /** Mensagem auxiliar à esquerda. */
  hint?: string;
  /** Ação secundária opcional (ex.: cancelar). */
  secondary?: { label: string; onClick: () => void };
  disabled?: boolean;
  className?: string;
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 5_000) return "agora";
  if (diff < 60_000) return `há ${Math.floor(diff / 1000)}s`;
  if (diff < 3_600_000) return `há ${Math.floor(diff / 60_000)} min`;
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function StickySaveBar({
  dirty,
  saving,
  savedAt,
  onSave,
  label = "Salvar",
  hint,
  secondary,
  disabled,
  className,
}: StickySaveBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-30 mt-8 -mx-4 md:-mx-6 lg:-mx-8",
        "bg-background/95 backdrop-blur border-t border-border",
        "px-4 md:px-6 lg:px-8 py-3 flex items-center gap-3 flex-wrap",
        className,
      )}
      role="region"
      aria-label="Salvar alterações"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1 min-w-0">
        {dirty ? (
          <>
            <AlertCircle className="h-4 w-4 text-primary shrink-0" />
            <span>Alterações não salvas{hint ? ` • ${hint}` : ""}</span>
          </>
        ) : savedAt ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">Rascunho salvo {formatRelative(savedAt)}{hint ? ` • ${hint}` : ""}</span>
          </>
        ) : hint ? (
          <span className="truncate">{hint}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        {secondary && (
          <Button variant="ghost" size="sm" onClick={secondary.onClick} disabled={saving}>
            {secondary.label}
          </Button>
        )}
        <Button
          onClick={onSave}
          disabled={disabled || saving}
          size="sm"
          className="min-w-[120px]"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />{label}</>
          )}
        </Button>
      </div>
    </div>
  );
}
