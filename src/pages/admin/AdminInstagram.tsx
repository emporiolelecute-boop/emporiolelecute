import SingleImageUpload from '@/components/admin/SingleImageUpload';
import InstagramSyncManager from '@/components/admin/InstagramSyncManager';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Save, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminInstagramPosts,
  useSaveInstagramPost,
  useDeleteInstagramPost,
  InstagramPost,
} from "@/hooks/useInstagramPosts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const blank: Partial<InstagramPost> = {
  image_url: "",
  alt_text: "Empório LeleCute - Instagram",
  post_url: "",
  position: 0,
  is_visible: true,
};

const AdminInstagram = () => {
  const { data: posts, isLoading } = useAdminInstagramPosts();
  const save = useSaveInstagramPost();
  const del = useDeleteInstagramPost();
  const { toast } = useToast();
  const [form, setForm] = useState<Partial<InstagramPost>>(blank);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `instagram/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: "Imagem enviada" });
    } catch (e: any) {
      toast({ title: "Erro no upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast({ title: "Adicione uma imagem", variant: "destructive" });
      return;
    }
    await save.mutateAsync(form);
    toast({ title: form.id ? "Post atualizado" : "Post criado" });
    setForm(blank);
  };

  const [syncing, setSyncing] = useState(false);
  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('instagram-sync');
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error + ((data as any).hint ? ` — ${(data as any).hint}` : ''));
      toast({ title: 'Sincronizado', description: `${(data as any).synced} posts importados do Instagram.` });
      window.location.reload();
    } catch (e: any) {
      toast({ title: 'Falha na sincronização', description: e.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Instagram className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-display">Posts do Instagram</h1>
            <p className="text-sm text-muted-foreground">
              Sincronize automaticamente do @emporiolelecute ou adicione manualmente. Os 6 primeiros visíveis aparecem no site.
            </p>
          </div>
        </div>
        <Button onClick={handleSync} disabled={syncing} variant="outline">
          {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Sincronizar do Instagram
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{form.id ? "Editar post" : "Adicionar novo post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Imagem</Label>
            <SingleImageUpload
              value={form.image_url || ''}
              onChange={(url) => setForm({ ...form, image_url: url })}
              folder="instagram"
              hint="Quadrado 1:1 · PNG, JPG ou WEBP até 5MB"
              previewMaxWidth={220}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Texto alternativo</Label>
              <Input value={form.alt_text || ""} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} />
            </div>
            <div>
              <Label>Link do post (opcional)</Label>
              <Input
                placeholder="https://instagram.com/p/..."
                value={form.post_url || ""}
                onChange={(e) => setForm({ ...form, post_url: e.target.value })}
              />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={form.position ?? 0}
                onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={form.is_visible ?? true}
                onCheckedChange={(v) => setForm({ ...form, is_visible: v })}
              />
              <Label>Visível no site</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={save.isPending || uploading}>
              {save.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {form.id ? "Salvar alterações" : "Adicionar post"}
            </Button>
            {form.id && (
              <Button variant="outline" onClick={() => setForm(blank)}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts cadastrados ({posts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : !posts?.length ? (
            <p className="text-muted-foreground text-sm">Nenhum post cadastrado.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((p) => (
                <div key={p.id} className="relative group border rounded-lg overflow-hidden">
                  <img src={p.image_url} alt={p.alt_text} className="w-full aspect-square object-cover" />
                  <div className="p-2 text-xs">
                    <p className="truncate">#{p.position} {p.is_visible ? "✓" : "✗"}</p>
                  </div>
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setForm(p)}>Editar</Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        if (confirm("Excluir este post?")) {
                          await del.mutateAsync(p.id);
                          toast({ title: "Post removido" });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInstagram;
