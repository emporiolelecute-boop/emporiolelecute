import { useMemo, useState } from "react";
import { icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideIcon } from "@/components/LucideIcon";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface LucideIconPickerProps {
  value?: string | null;
  onChange: (name: string | null) => void;
  className?: string;
}

const ALL_ICON_NAMES = Object.keys(icons).sort();

export const LucideIconPicker = ({ value, onChange, className }: LucideIconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(q))
      : ALL_ICON_NAMES;
    return list.slice(0, 300);
  }, [query]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="gap-2">
            <LucideIcon name={value} className="w-4 h-4" />
            <span className="text-sm">{value || "Escolher ícone"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-2" align="start">
          <Input
            autoFocus
            placeholder="Buscar ícone Lucide..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2"
          />
          <ScrollArea className="h-[280px]">
            <div className="grid grid-cols-6 gap-1">
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-md hover:bg-accent transition-colors",
                    value === name && "bg-accent ring-2 ring-primary"
                  )}
                >
                  <LucideIcon name={name} className="w-5 h-5" />
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum ícone encontrado
              </p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange(null)}
          aria-label="Remover ícone"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default LucideIconPicker;
