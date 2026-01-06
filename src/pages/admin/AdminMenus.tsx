import { useState } from 'react';
import { Menu, Plus, Trash2, Loader2, GripVertical, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, MenuItem } from '@/hooks/useMenus';
import { usePages } from '@/hooks/usePages';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminMenus = () => {
  const { data: allMenuItems, isLoading } = useMenuItems();
  const { data: pages } = usePages();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const { toast } = useToast();

  const [activeLocation, setActiveLocation] = useState<'header' | 'footer'>('header');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    label: '',
    url: '',
    page_id: '',
    is_external: false,
  });

  const menuItems = allMenuItems?.filter(item => item.menu_location === activeLocation) || [];

  const handleCreate = async () => {
    if (!newItem.label) {
      toast({ title: 'Informe o label do item', variant: 'destructive' });
      return;
    }

    if (!newItem.url && !newItem.page_id) {
      toast({ title: 'Informe uma URL ou selecione uma página', variant: 'destructive' });
      return;
    }

    try {
      const nextPosition = Math.max(...(menuItems.map(m => m.position) || [0]), 0) + 1;
      
      await createMenuItem.mutateAsync({
        menu_location: activeLocation,
        label: newItem.label,
        url: newItem.page_id ? null : newItem.url,
        page_id: newItem.page_id || null,
        is_external: newItem.is_external,
        is_visible: true,
        position: nextPosition,
        parent_id: null,
      });

      setNewItem({ label: '', url: '', page_id: '', is_external: false });
      setIsDialogOpen(false);
      toast({ title: 'Item criado com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro ao criar item', variant: 'destructive' });
    }
  };

  const handleToggleVisibility = async (item: MenuItem) => {
    try {
      await updateMenuItem.mutateAsync({
        id: item.id,
        is_visible: !item.is_visible,
      });
    } catch (error) {
      toast({ title: 'Erro ao atualizar item', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMenuItem.mutateAsync(deleteId);
      setDeleteId(null);
      toast({ title: 'Item excluído com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro ao excluir item', variant: 'destructive' });
    }
  };

  const getPageByID = (pageId: string | null) => {
    if (!pageId) return null;
    return pages?.find(p => p.id === pageId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
            <Menu className="w-8 h-8 text-primary" />
            Menus
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os menus de navegação do site</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Item de Menu</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={newItem.label}
                  onChange={(e) => setNewItem(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Texto do link"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Vincular a</Label>
                <Select
                  value={newItem.page_id}
                  onValueChange={(value) => setNewItem(prev => ({ 
                    ...prev, 
                    page_id: value === 'custom' ? '' : value,
                    url: value === 'custom' ? prev.url : ''
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma página ou URL personalizada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">URL Personalizada</SelectItem>
                    {pages?.filter(p => p.status === 'published').map(page => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!newItem.page_id && (
                <div>
                  <Label>URL</Label>
                  <Input
                    value={newItem.url}
                    onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="/pagina ou https://..."
                    className="mt-1"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Link externo (abre em nova aba)</Label>
                <Switch
                  checked={newItem.is_external}
                  onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, is_external: checked }))}
                />
              </div>

              <Button onClick={handleCreate} className="w-full" disabled={createMenuItem.isPending}>
                {createMenuItem.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Location tabs */}
      <Tabs value={activeLocation} onValueChange={(v) => setActiveLocation(v as 'header' | 'footer')}>
        <TabsList className="mb-6">
          <TabsTrigger value="header">Menu Principal (Header)</TabsTrigger>
          <TabsTrigger value="footer">Rodapé (Footer)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeLocation}>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : menuItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                Nenhum item no menu {activeLocation === 'header' ? 'principal' : 'do rodapé'}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {menuItems.sort((a, b) => a.position - b.position).map((item) => (
                <Card key={item.id} className="group">
                  <CardContent className="flex items-center gap-4 py-3">
                    <div className="cursor-grab text-muted-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{item.label}</span>
                        {item.is_external && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                        {item.page_id && <FileText className="w-3 h-3 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.page_id ? `→ ${getPageByID(item.page_id)?.slug || 'página'}` : item.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_visible}
                        onCheckedChange={() => handleToggleVisibility(item)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir item?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMenus;
