import { useState } from "react";
import { Plus, Trash2, ExternalLink, Eye, EyeOff, Save, Instagram } from "lucide-react";
import { toast } from "sonner";
import {
  useInstagramFeedEmbedsAdmin,
  useSaveInstagramFeedEmbed,
  useDeleteInstagramFeedEmbed,
  INSTAGRAM_URL_REGEX,
  type InstagramFeedEmbed,
} from "@/hooks/useInstagramFeedEmbeds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Draft = Partial<InstagramFeedEmbed>;

const emptyDraft: Draft = { post_url: "", caption: "", position: 0, is_active: true };

const AdminFeedInstagram = () => {
  const { data: items = [], isLoading } = useInstagramFeedEmbedsAdmin();
  const save = useSaveInstagramFeedEmbed();
  const del = useDeleteInstagramFeedEmbed();
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const isValidUrl = (url: string) => INSTAGRAM_URL_REGEX.test(url.trim());

  const handleAdd = async () => {
    if (!draft.post_url || !isValidUrl(draft.post_url)) {
      toast.error("URL inválida. Use formato: instagram.com/p/, /reel/ ou /tv/");
      return;
    }
    try {
      await save.mutateAsync({
        ...draft,
        position: items.length,
      });
      toast.success("Post adicionado ao feed");
      setDraft(emptyDraft);
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar");
    }
  };

  const handleUpdate = async (item: InstagramFeedEmbed, patch: Partial<InstagramFeedEmbed>) => {
    try {
      await save.mutateAsync({ ...item, ...patch });
    } catch (e: any) {
      toast.error(e.message || "Erro ao atualizar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este post do feed?")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Removido");
    } catch (e: any) {
      toast.error(e.message || "Erro ao remover");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center gap-3">
        <Instagram className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-display">Feed Instagram (Embed Oficial)</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre URLs de posts públicos. O Instagram renderiza imagem, legenda e link
            automaticamente via embed.js. Sem scraping, sem tokens, máximo 6 visíveis no site.
          </p>
        </div>
      </header>

      <Card className="p-5 space-y-4 border-primary/30">
        <h2 className="font-medium">Adicionar novo post</h2>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto] items-end">
          <div className="space-y-1">
            <Label>URL do post</Label>
            <Input
              placeholder="https://www.instagram.com/p/XXXXXXXXX/"
              value={draft.post_url || ""}
              onChange={(e) => setDraft({ ...draft, post_url: e.target.value })}
            />
            {draft.post_url && !isValidUrl(draft.post_url) && (
              <p className="text-xs text-destructive">
                Formato esperado: /p/, /reel/ ou /tv/
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Legenda fallback (opcional)</Label>
            <Input
              placeholder="Ver no Instagram"
              value={draft.caption || ""}
              onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd} disabled={save.isPending}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="font-medium">
          Posts cadastrados {items.length > 0 && <Badge variant="secondary">{items.length}</Badge>}
        </h2>
        {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
        {!isLoading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum post cadastrado.</p>
        )}

        {items.map((item, idx) => (
          <Card key={item.id} className="p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] items-center">
              <div className="space-y-1 min-w-0">
                <a
                  href={item.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate flex items-center gap-1"
                >
                  {item.post_url} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
                {item.caption && (
                  <p className="text-xs text-muted-foreground truncate">{item.caption}</p>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={idx > 5 ? "outline" : "default"}>
                    {idx > 5 ? `Excedente (#${idx + 1})` : `Visível #${idx + 1}`}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs">Ordem</Label>
                <Input
                  type="number"
                  className="w-20"
                  defaultValue={item.position}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v !== item.position) handleUpdate(item, { position: v });
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                {item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                <Switch
                  checked={item.is_active}
                  onCheckedChange={(checked) => handleUpdate(item, { is_active: checked })}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
                aria-label="Remover"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 bg-muted/30">
        <h2 className="font-medium mb-2 flex items-center gap-2">
          <Save className="h-4 w-4" /> Como funciona
        </h2>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Use o componente <code>&lt;InstagramFeedEmbed /&gt;</code> em qualquer página.</li>
          <li>O Instagram renderiza tudo: imagem, legenda, layout. Você só fornece a URL.</li>
          <li>Lazy-load: embeds carregam apenas quando entram na viewport.</li>
          <li>Limite de 6 posts visíveis. Itens excedentes ficam ocultos.</li>
          <li>Se o Instagram bloquear um embed, ele falha silenciosamente sem fallback.</li>
        </ul>
      </Card>
    </div>
  );
};

export default AdminFeedInstagram;
