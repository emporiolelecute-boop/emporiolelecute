import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, Check, X, Search, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { trackAdminEvent } from '@/lib/adminUsage';
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
import { useDbOccasions, useCreateOccasion, useDeleteOccasion, useUpdateOccasion } from '@/hooks/useProducts';
import { useSlugAvailability } from '@/hooks/useSlugAvailability';

const AdminOccasions = () => {
  const { data: occasions, isLoading } = useDbOccasions();
  const createOccasion = useCreateOccasion();
  const deleteOccasion = useDeleteOccasion();
  const updateOccasion = useUpdateOccasion();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const createSlugCheck = useSlugAvailability('occasions', formData.slug, null);
  const editSlugCheck = useSlugAvailability('occasions', editSlug, editingId);

  // Usage telemetry: open/submit/abandon for create dialog.
  const createState = useRef({ opened: false, submitted: false });
  useEffect(() => {
    if (isDialogOpen) {
      trackAdminEvent('form_open', 'occasion_create');
      createState.current = { opened: true, submitted: false };
    } else if (createState.current.opened && !createState.current.submitted) {
      trackAdminEvent('form_abandon', 'occasion_create');
      createState.current.opened = false;
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (!searchQuery) return;
    const t = setTimeout(() => trackAdminEvent('list_search', 'occasions'), 700);
    return () => clearTimeout(t);
  }, [searchQuery]);

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
      await createOccasion.mutateAsync(formData);
      toast({ title: 'Ocasião criada com sucesso!' });
      setFormData({ name: '', slug: '' });
      setIsDialogOpen(false);
    } catch {
      toast({ title: 'Erro ao criar ocasião', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteOccasion.mutateAsync(deleteId);
      toast({ title: 'Ocasião excluída com sucesso!' });
    } catch {
      toast({ title: 'Erro ao excluir ocasião', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  const handleStartEdit = (occasion: { id: string; name: string; slug: string }) => {
    setEditingId(occasion.id);
    setEditName(occasion.name);
    setEditSlug(occasion.slug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditSlug('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim() || !editSlug.trim()) return;
    
    try {
      await updateOccasion.mutateAsync({
        id: editingId,
        name: editName.trim(),
        slug: editSlug.trim(),
      });
      toast({ title: 'Ocasião atualizada com sucesso!' });
      handleCancelEdit();
    } catch {
      toast({ title: 'Erro ao atualizar ocasião', variant: 'destructive' });
    }
  };

  const filteredOccasions = occasions?.filter(occ =>
    occ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    occ.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Ocasiões
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie as ocasiões dos produtos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Ocasião
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Ocasião</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Nome da ocasião"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-da-ocasiao"
                  aria-describedby="create-slug-status"
                  aria-invalid={createSlugCheck.status === 'taken' || createSlugCheck.status === 'invalid'}
                />
                <p
                  id="create-slug-status"
                  aria-live="polite"
                  className={`text-xs flex items-center gap-1 min-h-[1rem] ${
                    createSlugCheck.status === 'available'
                      ? 'text-emerald-600'
                      : createSlugCheck.status === 'taken' || createSlugCheck.status === 'invalid'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {createSlugCheck.status === 'checking' && <Loader2 className="h-3 w-3 animate-spin" aria-hidden />}
                  {createSlugCheck.status === 'available' && <Check className="h-3 w-3" aria-hidden />}
                  {(createSlugCheck.status === 'taken' || createSlugCheck.status === 'invalid') && (
                    <AlertCircle className="h-3 w-3" aria-hidden />
                  )}
                  <span>{createSlugCheck.message}</span>
                </p>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createOccasion.isPending}>
                {createOccasion.isPending ? 'Criando...' : 'Criar Ocasião'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ocasiões..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-display">Todas as Ocasiões ({filteredOccasions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3" aria-busy="true" aria-live="polite">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-muted/50 animate-pulse" />
              ))}
              <span className="sr-only">Carregando ocasiões…</span>
            </div>
          ) : filteredOccasions && filteredOccasions.length > 0 ? (
            <div className="space-y-3">
              {filteredOccasions.map((occasion) => (
                <div
                  key={occasion.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {editingId === occasion.id ? (
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
                      <div className="flex-1 min-w-0">
                        <Input
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="max-w-xs"
                          placeholder="Slug"
                          aria-describedby="edit-slug-status"
                          aria-invalid={editSlugCheck.status === 'taken' || editSlugCheck.status === 'invalid'}
                        />
                        <p
                          id="edit-slug-status"
                          aria-live="polite"
                          className={`text-xs flex items-center gap-1 min-h-[1rem] ${
                            editSlugCheck.status === 'available'
                              ? 'text-emerald-600'
                              : editSlugCheck.status === 'taken' || editSlugCheck.status === 'invalid'
                              ? 'text-destructive'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {editSlugCheck.status === 'checking' && <Loader2 className="h-3 w-3 animate-spin" aria-hidden />}
                          {editSlugCheck.status === 'available' && <Check className="h-3 w-3" aria-hidden />}
                          {(editSlugCheck.status === 'taken' || editSlugCheck.status === 'invalid') && (
                            <AlertCircle className="h-3 w-3" aria-hidden />
                          )}
                          <span>{editSlugCheck.message}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                        disabled={updateOccasion.isPending}
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
                      <div className="cursor-pointer" onClick={() => handleStartEdit(occasion)}>
                        <p className="font-medium text-foreground">{occasion.name}</p>
                        <p className="text-sm text-muted-foreground">{occasion.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(occasion)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(occasion.id)}
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
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center" aria-hidden>
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {searchQuery ? 'Nenhuma ocasião encontrada' : 'Nenhuma ocasião cadastrada'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? 'Tente outro termo de busca ou limpe o filtro.'
                    : 'Crie a primeira ocasião para classificar produtos por momento.'}
                </p>
              </div>
              {!searchQuery && (
                <Button onClick={() => setIsDialogOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar primeira ocasião
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir ocasião?</AlertDialogTitle>
            <AlertDialogDescription>
              Os produtos vinculados ficarão sem esta ocasião. Esta ação não pode ser desfeita.
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

export default AdminOccasions;
