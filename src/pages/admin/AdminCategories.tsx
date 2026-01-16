import { useState } from 'react';
import { Plus, Trash2, Edit, Check, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { useDbCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useProducts';

const AdminCategories = () => {
  const { data: categories, isLoading } = useDbCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({ name, slug: generateSlug(name) });
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    try {
      await createCategory.mutateAsync(formData);
      toast({ title: 'Categoria criada com sucesso!' });
      setFormData({ name: '', slug: '' });
      setIsDialogOpen(false);
    } catch {
      toast({ title: 'Erro ao criar categoria', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast({ title: 'Categoria excluída com sucesso!' });
    } catch {
      toast({ title: 'Erro ao excluir categoria', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const handleStartEdit = (category: { id: string; name: string; slug: string }) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditSlug('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim() || !editSlug.trim()) return;
    
    try {
      await updateCategory.mutateAsync({
        id: editingId,
        name: editName.trim(),
        slug: editSlug.trim(),
      });
      toast({ title: 'Categoria atualizada com sucesso!' });
      handleCancelEdit();
    } catch {
      toast({ title: 'Erro ao atualizar categoria', variant: 'destructive' });
    }
  };

  const filteredCategories = categories?.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Categorias</h1>
          <p className="text-muted-foreground mt-1">Gerencie as categorias de produtos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-da-categoria"
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createCategory.isPending}>
                {createCategory.isPending ? 'Criando...' : 'Criar Categoria'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar categorias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Todas as Categorias ({filteredCategories?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCategories && filteredCategories.length > 0 ? (
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {editingId === category.id ? (
                    <div className="flex-1 flex items-center gap-3">
                      <Input
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                          setEditSlug(generateSlug(e.target.value));
                        }}
                        className="max-w-xs"
                        placeholder="Nome"
                      />
                      <Input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="max-w-xs"
                        placeholder="Slug"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                        disabled={updateCategory.isPending}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="cursor-pointer" onClick={() => handleStartEdit(category)}>
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(category)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Produtos vinculados ficarão sem
              categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
