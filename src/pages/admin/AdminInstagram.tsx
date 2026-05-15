import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2, Save, Instagram, Sparkles, GripVertical, ExternalLink, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminInstagramPosts,
  useSaveInstagramPost,
  useDeleteInstagramPost,
  InstagramPost,
} from "@/hooks/useInstagramPosts";
import { supabase } from "@/integrations/supabase/client";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";

const blank: Partial<InstagramPost> = {
  image_url: "",
  alt_text: "Empório LeleCute - Instagram",
  post_url: "",
  position: 0,
  is_visible: true,
};

function SortableCard({
  post,
  onEdit,
  onDelete,
}: {
  post: InstagramPost;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: post.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden border bg-card ${
        isDragging ? "opacity-60 z-50" : ""
      } ${!post.is_visible ? "opacity-50" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 bg-background/80 rounded-md opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <img
        src={post.image_url}
        alt={post.alt_text}
        loading="lazy"
        className="w-full aspect-square object-cover"
      />
      <div className="p-2 text-xs flex items-center justify-between gap-2">
        <span className="truncate">#{post.position} {post.is_visible ? "✓" : "oculto"}</span>
        {post.post_url && (
          <a
            href={post.post_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-2 flex gap-2 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-foreground/70 to-transparent">
        <Button size="sm" variant="secondary" onClick={onEdit} className="flex-1">
          <Pencil className="w-3 h-3 mr-1" /> Editar
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

const AdminInstagram = () => {
  const { data: posts, isLoading } = useAdminInstagramPosts();
  const save = useSaveInstagramPost();
  const del = useDeleteInstagramPost();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState<Partial<InstagramPost>>(blank);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleExtract = async () => {
    if (!instagramUrl.trim()) {
      toast({ title: "Cole a URL do post", variant: "destructive" });
      return;
    }
    setExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke("instagram-oembed", {
        body: { url: instagramUrl.trim() },
      });
      if (error) throw error;
      if (data?.image_url) {
        setForm((f) => ({
          ...f,
          image_url: data.image_url,
          post_url: data.permalink || instagramUrl.trim(),
          alt_text: data.title?.slice(0, 200) || f.alt_text,
        }));
        toast({ title: "Thumbnail extraída", description: "Revise e salve abaixo." });
      } else {
        setForm((f) => ({ ...f, post_url: data?.permalink || instagramUrl.trim() }));
        toast({
          title: "Não foi possível extrair automaticamente",
          description: "Faça upload manual da imagem abaixo.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      toast({ title: "Erro na extração", description: e.message, variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast({ title: "Adicione uma imagem", variant: "destructive" });
      return;
    }
    const nextPosition =
      form.id != null ? form.position ?? 0 : (posts?.length ?? 0) + 1;
    await save.mutateAsync({ ...form, position: nextPosition });
    toast({ title: form.id ? "Post atualizado" : "Post adicionado" });
    setForm(blank);
    setInstagramUrl("");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !posts) return;
    const oldIndex = posts.findIndex((p) => p.id === active.id);
    const newIndex = posts.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(posts, oldIndex, newIndex);
    setReordering(true);
    try {
      // Optimistic
      qc.setQueryData(["instagram_posts", "admin"], reordered.map((p, i) => ({ ...p, position: i + 1 })));
      await Promise.all(
        reordered.map((p, i) =>
          supabase.from("instagram_posts").update({ position: i + 1 }).eq("id", p.id),
        ),
      );
      qc.invalidateQueries({ queryKey: ["instagram_posts"] });
      toast({ title: "Ordem atualizada" });
    } catch (e: any) {
      toast({ title: "Erro ao reordenar", description: e.message, variant: "destructive" });
    } finally {
      setReordering(false);
    }
  };

  const toggleVisible = async (p: InstagramPost) => {
    await save.mutateAsync({ id: p.id, is_visible: !p.is_visible });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Instagram className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-2xl font-display">Últimas Postagens do Instagram</h1>
          <p className="text-sm text-muted-foreground">
            Cole a URL do post — extraímos a thumbnail automaticamente. Sem login, sem API oficial. Até 12 posts visíveis.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {form.id ? "Editar post" : "Adicionar novo post"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!form.id && (
            <div className="space-y-2">
              <Label>URL do post do Instagram</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.instagram.com/p/XXXXXXXXX/"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
                <Button onClick={handleExtract} disabled={extracting}>
                  {extracting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-1" />
                  )}
                  Extrair
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Funciona com posts, reels e IGTV públicos. Se a extração falhar, faça upload manual abaixo.
              </p>
            </div>
          )}

          <div>
            <Label>Imagem (thumbnail)</Label>
            <SingleImageUpload
              value={form.image_url || ""}
              onChange={(url) => setForm({ ...form, image_url: url })}
              folder="instagram"
              hint="Quadrado 1:1 recomendado · até 5MB"
              previewMaxWidth={220}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Título / texto alternativo</Label>
              <Input
                value={form.alt_text || ""}
                onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                placeholder="Descreva a imagem (alt text para SEO)"
              />
            </div>
            <div>
              <Label>Link do post</Label>
              <Input
                placeholder="https://instagram.com/p/..."
                value={form.post_url || ""}
                onChange={(e) => setForm({ ...form, post_url: e.target.value })}
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
            <Button onClick={handleSave} disabled={save.isPending}>
              {save.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {form.id ? "Salvar alterações" : "Adicionar post"}
            </Button>
            {(form.id || form.image_url || instagramUrl) && (
              <Button
                variant="outline"
                onClick={() => {
                  setForm(blank);
                  setInstagramUrl("");
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Posts cadastrados ({posts?.length || 0})</span>
            {reordering && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : !posts?.length ? (
            <p className="text-muted-foreground text-sm">
              Nenhum post cadastrado. Cole uma URL acima para começar.
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                Arraste pelo ícone <GripVertical className="inline w-3 h-3" /> para reordenar.
                Os 12 primeiros visíveis aparecem no site.
              </p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={posts.map((p) => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {posts.map((p) => (
                      <SortableCard
                        key={p.id}
                        post={p}
                        onEdit={() => setForm(p)}
                        onDelete={async () => {
                          if (confirm("Excluir este post?")) {
                            await del.mutateAsync(p.id);
                            toast({ title: "Post removido" });
                          }
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-4 flex flex-wrap gap-2">
                {posts.map((p) => (
                  <Button
                    key={`tog-${p.id}`}
                    size="sm"
                    variant={p.is_visible ? "default" : "outline"}
                    onClick={() => toggleVisible(p)}
                  >
                    #{p.position} {p.is_visible ? "Visível" : "Oculto"}
                  </Button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInstagram;
