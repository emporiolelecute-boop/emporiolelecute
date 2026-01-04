import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useDbProduct,
  useDbCategories,
  useDbOccasions,
  useCreateProduct,
  useUpdateProduct,
  DbProduct,
} from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: existingProduct, isLoading: loadingProduct } = useDbProduct(id || '');
  const { data: categories } = useDbCategories();
  const { data: occasions } = useDbOccasions();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    price: '',
    original_price: '',
    min_quantity: '1',
    pix_discount: '3',
    production_days: '7',
    weight: '',
    category_id: '',
    badge: '',
    rating: '5.0',
    images: [''],
    features: [''],
    keywords: [''],
    elo7_link: '',
    is_active: true,
  });
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingProduct && isEditing) {
      setFormData({
        name: existingProduct.name,
        slug: existingProduct.slug,
        description: existingProduct.description || '',
        long_description: existingProduct.long_description || '',
        price: existingProduct.price.toString(),
        original_price: existingProduct.original_price?.toString() || '',
        min_quantity: existingProduct.min_quantity.toString(),
        pix_discount: existingProduct.pix_discount.toString(),
        production_days: existingProduct.production_days.toString(),
        weight: existingProduct.weight?.toString() || '',
        category_id: existingProduct.category_id || '',
        badge: existingProduct.badge || '',
        rating: existingProduct.rating.toString(),
        images: existingProduct.images.length > 0 ? existingProduct.images : [''],
        features: existingProduct.features.length > 0 ? existingProduct.features : [''],
        keywords: existingProduct.keywords.length > 0 ? existingProduct.keywords : [''],
        elo7_link: existingProduct.elo7_link || '',
        is_active: existingProduct.is_active,
      });

      // Load product occasions
      supabase
        .from('product_occasions')
        .select('occasion_id')
        .eq('product_id', existingProduct.id)
        .then(({ data }) => {
          if (data) {
            setSelectedOccasions(data.map((o) => o.occasion_id));
          }
        });
    }
  }, [existingProduct, isEditing]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !isEditing || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug,
    }));
  };

  const handleArrayChange = (field: 'images' | 'features' | 'keywords', index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: 'images' | 'features' | 'keywords') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field: 'images' | 'features' | 'keywords', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || !formData.price) {
      toast({ title: 'Preencha os campos obrigatórios', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      const productData: Omit<DbProduct, 'id' | 'created_at' | 'updated_at'> = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        long_description: formData.long_description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        min_quantity: parseInt(formData.min_quantity) || 1,
        pix_discount: parseInt(formData.pix_discount) || 3,
        production_days: parseInt(formData.production_days) || 7,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        category_id: formData.category_id || null,
        badge: formData.badge || null,
        rating: parseFloat(formData.rating) || 5.0,
        images: formData.images.filter(Boolean),
        features: formData.features.filter(Boolean),
        keywords: formData.keywords.filter(Boolean),
        elo7_link: formData.elo7_link || null,
        is_active: formData.is_active,
      };

      let productId: string;

      if (isEditing && id) {
        await updateProduct.mutateAsync({ id, ...productData });
        productId = id;
      } else {
        const result = await createProduct.mutateAsync(productData);
        productId = result.id;
      }

      // Update product occasions
      await supabase.from('product_occasions').delete().eq('product_id', productId);
      
      if (selectedOccasions.length > 0) {
        await supabase.from('product_occasions').insert(
          selectedOccasions.map((occasionId) => ({
            product_id: productId,
            occasion_id: occasionId,
          }))
        );
      }

      toast({ title: isEditing ? 'Produto atualizado!' : 'Produto criado!' });
      navigate('/admin/produtos');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ title: 'Erro ao salvar produto', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing && loadingProduct) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/produtos')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-display font-semibold text-foreground">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-display">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nome do produto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="slug-do-produto"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição curta</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição breve do produto"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Descrição detalhada</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Descrição completa com detalhes do produto"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Produto ativo</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">Ocasiões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {occasions?.map((occ) => (
                    <label key={occ.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOccasions((prev) => [...prev, occ.id]);
                          } else {
                            setSelectedOccasions((prev) => prev.filter((id) => id !== occ.id));
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{occ.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">Preços e Quantidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Preço original</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, original_price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_quantity">Qtd. mínima</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, min_quantity: e.target.value }))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix_discount">Desconto PIX (%)</Label>
                <Input
                  id="pix_discount"
                  type="number"
                  value={formData.pix_discount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pix_discount: e.target.value }))}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="production_days">Prazo (dias)</Label>
                <Input
                  id="production_days"
                  type="number"
                  value={formData.production_days}
                  onChange={(e) => setFormData((prev) => ({ ...prev, production_days: e.target.value }))}
                  placeholder="7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="0.100"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">Imagens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleArrayChange('images', index, e.target.value)}
                  placeholder="URL da imagem"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('images', index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem('images')}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar imagem
            </Button>
          </CardContent>
        </Card>

        {/* Features & Keywords */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-display">Características</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleArrayChange('features', index, e.target.value)}
                    placeholder="Característica do produto"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('features', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem('features')}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar característica
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-display">Palavras-chave (SEO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={keyword}
                    onChange={(e) => handleArrayChange('keywords', index, e.target.value)}
                    placeholder="Palavra-chave"
                  />
                  {formData.keywords.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem('keywords', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem('keywords')}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar palavra-chave
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display">Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="Ex: Mais Vendido"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                  placeholder="5.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elo7_link">Link Elo7</Label>
                <Input
                  id="elo7_link"
                  value={formData.elo7_link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, elo7_link: e.target.value }))}
                  placeholder="https://www.elo7.com.br/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/produtos')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'} Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
