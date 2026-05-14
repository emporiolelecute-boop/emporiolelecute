import { useState } from 'react';
import { useAdminHeroSlides, useUpsertHeroSlide, useDeleteHeroSlide, type HeroSlide } from '@/hooks/useHeroSlides';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

const empty: Partial<HeroSlide> = {
  tagline: '', title: '', subtitle: '', image_url: '', cta_label: '', cta_url: '', position: 0, is_visible: true,
};

const AdminHeroSlides = () => {
  const { data: slides, isLoading } = useAdminHeroSlides();
  const upsert = useUpsertHeroSlide();
  const remove = useDeleteHeroSlide();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<HeroSlide>>(empty);

  const startNew = () => {
    setForm({ ...empty, position: (slides?.length || 0) });
    setOpen(true);
  };
  const startEdit = (s: HeroSlide) => { setForm(s); setOpen(true); };

  const save = async () => {
    if (!form.title) return;
    await upsert.mutateAsync(form);
    setOpen(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display">Slides do Hero</h1>
          <p className="text-muted-foreground">Edite os banners exibidos no topo da Home.</p>
        </div>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-2" /> Novo slide</Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : (
        <div className="space-y-3">
          {(slides || []).map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
                  {s.image_url ? <img src={s.image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{s.title}</p>
                  {s.tagline && <p className="text-xs text-primary truncate">{s.tagline}</p>}
                  {s.subtitle && <p className="text-sm text-muted-foreground truncate">{s.subtitle}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Posição #{s.position}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => upsert.mutate({ id: s.id, is_visible: !s.is_visible })} title={s.is_visible ? 'Ocultar' : 'Mostrar'}>
                    {s.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 opacity-50" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Excluir este slide?')) remove.mutate(s.id); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(slides || []).length === 0 && (
            <p className="text-muted-foreground text-center py-12">Nenhum slide. Clique em "Novo slide".</p>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{form.id ? 'Editar slide' : 'Novo slide'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tagline (chip pequeno acima do título)</Label>
              <Input value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </div>
            <div>
              <Label>Título *</Label>
              <Input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Textarea value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div>
              <Label>URL da imagem</Label>
              <Input value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Texto do botão (opcional)</Label>
                <Input value={form.cta_label || ''} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
              </div>
              <div>
                <Label>URL do botão</Label>
                <Input value={form.cta_url || ''} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <Label>Posição</Label>
                <Input type="number" value={form.position ?? 0} onChange={(e) => setForm({ ...form, position: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_visible ?? true} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
                <Label>Visível</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={!form.title || upsert.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHeroSlides;
