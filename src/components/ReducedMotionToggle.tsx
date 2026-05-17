import { Sparkles, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Discreet "calm mode" toggle. Pluggable anywhere in the header / footer.
 * Persists locally; respects system preference as default.
 */
export function ReducedMotionToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useReducedMotion();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={
        enabled
          ? "Reativar animações da interface"
          : "Reduzir animações da interface"
      }
      title={enabled ? "Animações reduzidas" : "Animações ativas"}
      className={className}
    >
      {enabled ? <MinusCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
    </Button>
  );
}

export default ReducedMotionToggle;
