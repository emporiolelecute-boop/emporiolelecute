import SingleImageUpload from '@/components/admin/SingleImageUpload';
import { useState } from 'react';
import {
  useAdminHeroSlides,
  useUpsertHeroSlide,
  useDeleteHeroSlide,
  type HeroSlide,
  type HeroSlideMode,
} from '@/hooks/useHeroSlides';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  LayoutTemplate,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Mode selector
// ---------------------------------------------------------------------------

const MODES: { value: HeroSlideMode; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'text_image',
    label: 'Texto + Imagem',
    icon: <LayoutTemplate className="h-5 w-5" />,
    description: 'Layout padrão: texto à esquerda e imagem à direita. Aparece em todos os tamanhos de tela.',
  },
  {
    value: 'banner_mobile',
    label: 'Banner Mobile',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Banner full-width sem texto. Visível apenas em celular e tablet. Some no desktop.',
  },
  {
    value: 'banner_desktop',
    label: 'Banner Desktop',
    icon: <Monitor className="h-5 w-5" />,
    description: 'Banner full-width sem texto. Visível apenas no desktop. Some no celular.',
  },
];

function ModeSelector({
  value,
  onChange,
}: {
  value: HeroSlideMode;
  onChange: (v: HeroSlideMode) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={cn(
            'flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all',
            value === m.value
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-muted/50',
          )}
        >
          <div className={cn('flex items-center gap-2 font-medium text-sm', value === m.value ? 'text-primary' : 'text-foreground')}>
            {m.icon}
            {m.label}
          </div>
          <p className="text-xs text-muted-foreground leading-snug">{m.description}</p>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mode badge for the list
// ---------------------------------------------------------------------------

function ModeBadge({ mode }: { mode: HeroSlideMode }) {
  if (mode === 'banner_mobile')
    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <Smartphone className="h-3 w-3" /> Mobile
      </Badge>
    );
  if (mode === 'banner_desktop')
    return (
      <Badge variant="outline" className="gap-1 text-xs">
        <Monitor className="h-3 w-3" /> Desktop
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-xs">
      <LayoutTemplate className="h-3 w-3" /> Texto + Imagem
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Default form state
// ---------------------------------------------------------------------------

const empty: Partial<HeroSlide> = {
  display_mode: 'text_image',
  tagline: '',
  title: '',
  subtitle: '',
  image_url: '',
  image_mobile_url: '',
  image_alt: '',
  cta_label: '',
  cta_url: '',
  position: 0,
  is_visible: true,
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const AdminHeroSlides = () => {
  const { data: slides, isLoading } = useAdminHeroSlides();
  const upsert = useUpsertHeroSlide();
  const remove = useDeleteHeroSlide();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<HeroSlide>>(empty);

  const startNew = () => {
    setForm({ ...empty, position: slides?.length ?? 0 });
    setOpen(true);
  };
  const startEdit = (s: HeroSlide) => {
    setForm(s);
    setOpen(true);
  };

  const save = async () => {
    if (!form.title && form.display_mode === 'text_image') return;
    await upsert.mutateAsync(form);
    setOpen(false);
  };

  const mode = form.display_mode ?? 'text_image';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display">Slides do Hero</h1>
          <p className="text-muted-foreground">
            Gerencie os banners exibidos no topo da Home. Cada slide pode ser
            exibido como texto+imagem, banner mobile ou banner desktop.
          </p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4 mr-2" /> Novo slide
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : (
        <div className="space-y-3">
          {(slides || []).map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.image_alt || s.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{s.title || '(sem título)'}</p>
                    <ModeBadge mode={s.display_mode ?? 'text_image'} />
                  </div>
                  {s.tagline && (
                    <p className="text-xs text-primary truncate">{s.tagline}</p>
                  )}
                  {s.subtitle && (
                    <p className="text-sm text-muted-foreground truncate">{s.subtitle}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Posição #{s.position}
                    {s.image_alt && (
                      <span className="ml-2 text-muted-foreground/70">
                        alt: "{s.image_alt}"
                      </span>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => upsert.mutate({ id: s.id, is_visible: !s.is_visible })}
                    title={s.is_visible ? 'Ocultar' : 'Mostrar'}
                  >
                    {s.is_visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4 opacity-50" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Excluir este slide?')) remove.mutate(s.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(slides || []).length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              Nenhum slide. Clique em "Novo slide".
            </p>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Edit / New dialog                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Editar slide' : 'Novo slide'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* ---- Mode selector ---- */}
            <div>
              <Label className="mb-2 block">Tipo de slide *</Label>
              <ModeSelector
                value={mode}
                onChange={(v) => setForm({ ...form, display_mode: v })}
              />
            </div>

            {/* ---- Text fields — only for text_image mode ---- */}
            {mode === 'text_image' && (
              <>
                <div>
                  <Label>Tagline <span className="text-muted-foreground font-normal">(chip acima do título)</span></Label>
                  <Input
                    className="mt-1"
                    value={form.tagline || ''}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Ex: Ateliê Criativo"
                  />
                </div>
                <div>
                  <Label>Título *</Label>
                  <Input
                    className="mt-1"
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ex: Lembrancinhas que encantam"
                  />
                </div>
                <div>
                  <Label>Subtítulo</Label>
                  <Textarea
                    className="mt-1"
                    value={form.subtitle || ''}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Descrição curta exibida abaixo do título"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Texto do botão <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                    <Input
                      className="mt-1"
                      value={form.cta_label || ''}
                      onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                      placeholder="Ex: Ver produtos"
                    />
                  </div>
                  <div>
                    <Label>URL do botão</Label>
                    <Input
                      className="mt-1"
                      value={form.cta_url || ''}
                      onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
                      placeholder="/produtos"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ---- Image upload ---- */}
            {mode === 'text_image' && (
              <div>
                <Label>Imagem <span className="text-muted-foreground font-normal">(quadrada, ao lado do texto)</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  Recomendado 800×800 · PNG, JPG ou WEBP · até 5 MB
                </p>
                <SingleImageUpload
                  value={form.image_url || ''}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="hero"
                  hint="800×800 recomendado"
                  previewMaxWidth={320}
                />
              </div>
            )}

            {mode === 'banner_mobile' && (
              <div>
                <Label>Imagem do banner <span className="text-muted-foreground font-normal">(celular / tablet)</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  A imagem ocupa 100% da largura sem cortes. Recomendado proporção 9:16 ou 1:1 · PNG, JPG ou WEBP · até 5 MB
                </p>
                <SingleImageUpload
                  value={form.image_mobile_url || ''}
                  onChange={(url) => setForm({ ...form, image_mobile_url: url })}
                  folder="hero/mobile"
                  hint="Proporção 9:16 ou 1:1 recomendada"
                  previewMaxWidth={280}
                />
              </div>
            )}

            {mode === 'banner_desktop' && (
              <div>
                <Label>Imagem do banner <span className="text-muted-foreground font-normal">(desktop)</span></Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  A imagem ocupa 100% da largura sem cortes. Recomendado proporção 16:5 ou 16:6 · PNG, JPG ou WEBP · até 5 MB
                </p>
                <SingleImageUpload
                  value={form.image_url || ''}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="hero/desktop"
                  hint="Proporção 16:5 recomendada (ex: 1920×600)"
                  previewMaxWidth={480}
                />
              </div>
            )}

            {/* ---- Alt text — always shown ---- */}
            <div>
              <Label>
                Texto alternativo (alt) *{' '}
                <span className="text-muted-foreground font-normal">— acessibilidade e SEO</span>
              </Label>
              <Input
                className="mt-1"
                value={form.image_alt || ''}
                onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
                placeholder="Ex: Banner de lembrancinhas artesanais para chá de bebê"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Descreva o conteúdo da imagem para leitores de tela e mecanismos de busca.
              </p>
            </div>

            {/* ---- Position + Visibility ---- */}
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <Label>Posição</Label>
                <Input
                  type="number"
                  className="mt-1"
                  value={form.position ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, position: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch
                  checked={form.is_visible ?? true}
                  onCheckedChange={(v) => setForm({ ...form, is_visible: v })}
                />
                <Label>Visível</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={save}
              disabled={
                (mode === 'text_image' && !form.title) || upsert.isPending
              }
            >
              {upsert.isPending ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHeroSlides;
