import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, EyeOff, Home, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Kit } from "@/hooks/useKits";

const BUNDLE_LABEL: Record<Kit["bundle_type"], string> = {
  suggested: "Sugerido",
  curated: "Curado",
  premium: "Premium",
};

export default function AdminKits() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-kits"],
    queryFn: async (): Promise<Kit[]> => {
      const { data, error } = await (supabase as any)
        .from("kits")
        .select("*, kit_products(product_id)")
        .order("position", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        ...r,
        product_count: Array.isArray(r.kit_products) ? r.kit_products.length : 0,
      })) as Kit[];
    },
  });

  const toggleField = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: "is_active" | "show_on_home"; value: boolean }) => {
      const { error } = await (supabase as any).from("kits").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-kits"] }),
    onError: (e: Error) => toast({ title: "Erro ao atualizar", description: e.message, variant: "destructive" }),
  });

  const removeKit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("kits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-kits"] });
      toast({ title: "Kit removido" });
    },
    onError: (e: Error) => toast({ title: "Erro ao remover", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold">Kits editoriais</h1>
          <p className="text-sm text-muted-foreground">
            Agrupe produtos existentes em kits para temas como Chá de Bebê, Padrinhos ou Lavabo Completo. Não criam estoque próprio.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/kits/novo"><Plus className="h-4 w-4 mr-2" />Novo kit</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (data?.length ?? 0) === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-3 opacity-50" />
            Nenhum kit criado. Comece pelo primeiro!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data!.map((k) => (
            <Card key={k.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base font-display flex items-center gap-2 flex-wrap">
                      {k.name}
                      <Badge variant="secondary" className="text-[10px]">/{k.slug}</Badge>
                      <Badge variant="outline" className="text-[10px]">{BUNDLE_LABEL[k.bundle_type]}</Badge>
                      {!k.is_active && <Badge variant="outline" className="text-[10px]">Inativo</Badge>}
                      {k.show_on_home && <Badge className="text-[10px]"><Home className="h-3 w-3 mr-1" />Home</Badge>}
                    </CardTitle>
                    {k.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{k.description}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {k.product_count ?? 0} item{(k.product_count ?? 0) === 1 ? "" : "s"} • posição {k.position}
                      {k.estimated_savings ? ` • economia ~R$ ${Number(k.estimated_savings).toFixed(2).replace(".", ",")}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/kits/${k.id}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover kit?</AlertDialogTitle>
                          <AlertDialogDescription>
                            O kit "{k.name}" será removido. Os produtos não são apagados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeKit.mutate(k.id)}>Remover</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex items-center gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={k.is_active}
                    onCheckedChange={(v) => toggleField.mutate({ id: k.id, field: "is_active", value: v })}
                  />
                  {k.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span className="text-muted-foreground">Ativo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={k.show_on_home}
                    onCheckedChange={(v) => toggleField.mutate({ id: k.id, field: "show_on_home", value: v })}
                  />
                  <Home className="h-3.5 w-3.5" />
                  <span className="text-muted-foreground">Exibir na home</span>
                </label>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
