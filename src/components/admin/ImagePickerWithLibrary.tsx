import { useEffect, useState } from 'react';
import { Image as ImageIcon, Library, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import SingleImageUpload from './SingleImageUpload';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
}

interface BucketFile {
  name: string;
  publicUrl: string;
  updated_at?: string;
}

/**
 * Combined image picker: upload (drag/drop, paste URL) + library browser
 * that lists existing files in the public `product-images` bucket.
 */
export default function ImagePickerWithLibrary({ value, onChange, folder = 'occasions', hint }: Props) {
  const [libOpen, setLibOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<BucketFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(folder);
  const [folders, setFolders] = useState<string[]>([folder, 'misc', 'products', 'occasions', 'categories', 'hero', 'blog']);

  const loadFiles = async (subfolder: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list(subfolder, { limit: 200, sortBy: { column: 'updated_at', order: 'desc' } });
      if (error) throw error;
      const items = (data || [])
        .filter((f) => f.name && !f.name.endsWith('/') && /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(f.name))
        .map((f) => {
          const path = `${subfolder}/${f.name}`;
          const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
          return { name: f.name, publicUrl: pub.publicUrl, updated_at: f.updated_at };
        });
      setFiles(items);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (libOpen) void loadFiles(selectedFolder);
  }, [libOpen, selectedFolder]);

  // Try to list root folders the first time the dialog opens so we keep options fresh.
  useEffect(() => {
    if (!libOpen) return;
    (async () => {
      const { data } = await supabase.storage.from('product-images').list('', { limit: 100 });
      const found = (data || []).filter((d) => d.id === null).map((d) => d.name);
      if (found.length) {
        const merged = Array.from(new Set([folder, ...found])).slice(0, 20);
        setFolders(merged);
      }
    })();
  }, [libOpen, folder]);

  return (
    <div className="space-y-3">
      <SingleImageUpload value={value} onChange={onChange} folder={folder} hint={hint} allowUrlInput />

      <Dialog open={libOpen} onOpenChange={setLibOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <Library className="w-4 h-4" /> Escolher da biblioteca
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Biblioteca de imagens</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 mb-3">
            {folders.map((f) => (
              <Button
                key={f}
                type="button"
                size="sm"
                variant={f === selectedFolder ? 'default' : 'outline'}
                onClick={() => setSelectedFolder(f)}
              >
                {f}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando…
            </div>
          ) : files.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <ImageIcon className="w-8 h-8" />
              <p className="text-sm">Nenhuma imagem nesta pasta.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto p-1">
              {files.map((f) => (
                <button
                  key={f.publicUrl}
                  type="button"
                  onClick={() => { onChange(f.publicUrl); setLibOpen(false); }}
                  className={cn(
                    'group relative aspect-square rounded-lg overflow-hidden border bg-muted hover:ring-2 hover:ring-primary transition-all',
                    value === f.publicUrl && 'ring-2 ring-primary'
                  )}
                  title={f.name}
                >
                  <img
                    src={f.publicUrl}
                    alt={f.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLibOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
