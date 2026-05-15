import { useRef, useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  /** Mostrar campo opcional para também colar uma URL */
  allowUrlInput?: boolean;
  /** Largura máx. da prévia (px) */
  previewMaxWidth?: number;
  /** Texto de instrução (ex: "1200x630 recomendado") */
  hint?: string;
  /** Limite em MB (default 5) */
  maxSizeMB?: number;
}

/**
 * Upload simples de uma única imagem para o bucket público `product-images`.
 * Use para OG image, banners, capa de bloco, etc.
 */
export default function SingleImageUpload({
  value,
  onChange,
  folder = 'misc',
  allowUrlInput = true,
  previewMaxWidth = 320,
  hint,
  maxSizeMB = 5,
}: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido', { description: 'Apenas imagens são permitidas.' });
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error('Arquivo muito grande', { description: `Máximo ${maxSizeMB}MB.` });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file, {
        cacheControl: '3600', upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success('Imagem enviada');
    } catch (e) {
      toast.error('Falha no upload', { description: String(e instanceof Error ? e.message : e) });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = () => onChange('');

  return (
    <div className="space-y-3">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          'hover:border-primary hover:bg-primary/5',
          uploading && 'opacity-60 cursor-not-allowed',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Enviando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Upload className="w-6 h-6 text-muted-foreground" />
            <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        )}
      </div>

      {allowUrlInput && (
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="ou cole uma URL pública (https://...)"
            className="text-xs"
          />
        </div>
      )}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Pré-visualização"
            className="rounded-lg border bg-muted"
            style={{ maxWidth: previewMaxWidth, width: '100%', height: 'auto' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={remove}
            aria-label="Remover imagem"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          Nenhuma imagem definida.
        </div>
      )}
    </div>
  );
}
