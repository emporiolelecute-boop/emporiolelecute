import { useState, useEffect } from 'react';
import { Settings, Save, Phone, Mail, MapPin, Instagram, Facebook, ShoppingBag, Truck, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  homepage_config: {
    featured_products_count: number;
    featured_order: 'recent' | 'random' | 'category';
    show_categories_highlight: boolean;
    show_bestsellers: boolean;
    show_occasions: boolean;
  };
  contact_info: {
    whatsapp: string;
    email: string;
    address: string;
  };
  social_links: {
    instagram: string;
    facebook: string;
    elo7: string;
  };
  shipping_policy: {
    note: string;
    free_shipping_threshold: number;
  };
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<StoreSettings>({
    homepage_config: {
      featured_products_count: 6,
      featured_order: 'recent',
      show_categories_highlight: true,
      show_bestsellers: true,
      show_occasions: true,
    },
    contact_info: {
      whatsapp: '5541992214299',
      email: 'contato@emporiolelecute.com.br',
      address: 'São José dos Pinhais, PR',
    },
    social_links: {
      instagram: 'https://www.instagram.com/emporiolelecute',
      facebook: 'https://www.facebook.com/emporiolelecute',
      elo7: 'https://www.elo7.com.br/emporiolelecute',
    },
    shipping_policy: {
      note: 'O frete será calculado após a confirmação do pedido via WhatsApp',
      free_shipping_threshold: 0,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const newSettings = { ...settings };
        data.forEach((item: { key: string; value: any }) => {
          if (item.key in newSettings) {
            (newSettings as any)[item.key] = item.value;
          }
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('store_settings')
          .upsert({
            key,
            value,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'key'
          });

        if (error) throw error;
      }

      toast({
        title: "Configurações salvas!",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Configurações</span>
          </div>
          <h1 className="text-4xl font-display font-semibold text-foreground">Configurações da Loja</h1>
          <p className="text-muted-foreground mt-2">Gerencie as configurações gerais da sua loja</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary-dark text-primary-foreground"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Homepage Configuration */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Página Inicial
            </CardTitle>
            <CardDescription>Configure a exibição de produtos na home</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Quantidade de Produtos em Destaque</Label>
              <Select 
                value={settings.homepage_config.featured_products_count.toString()}
                onValueChange={(value) => setSettings({
                  ...settings,
                  homepage_config: {
                    ...settings.homepage_config,
                    featured_products_count: parseInt(value)
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 produtos</SelectItem>
                  <SelectItem value="6">6 produtos</SelectItem>
                  <SelectItem value="9">9 produtos</SelectItem>
                  <SelectItem value="12">12 produtos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ordem de Exibição</Label>
              <Select 
                value={settings.homepage_config.featured_order}
                onValueChange={(value: 'recent' | 'random' | 'category') => setSettings({
                  ...settings,
                  homepage_config: {
                    ...settings.homepage_config,
                    featured_order: value
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="random">Aleatório</SelectItem>
                  <SelectItem value="category">Por Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Exibir Categorias em Destaque</Label>
                  <p className="text-sm text-muted-foreground">Sabonetes, Velas, etc.</p>
                </div>
                <Switch 
                  checked={settings.homepage_config.show_categories_highlight}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    homepage_config: {
                      ...settings.homepage_config,
                      show_categories_highlight: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Exibir Mais Vendidos</Label>
                  <p className="text-sm text-muted-foreground">Seção "Nossos Favoritos"</p>
                </div>
                <Switch 
                  checked={settings.homepage_config.show_bestsellers}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    homepage_config: {
                      ...settings.homepage_config,
                      show_bestsellers: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Exibir Ocasiões Especiais</Label>
                  <p className="text-sm text-muted-foreground">Maternidade, Casamento, etc.</p>
                </div>
                <Switch 
                  checked={settings.homepage_config.show_occasions}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    homepage_config: {
                      ...settings.homepage_config,
                      show_occasions: checked
                    }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Informações de Contato
            </CardTitle>
            <CardDescription>Dados de contato exibidos no site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                WhatsApp
              </Label>
              <Input 
                value={settings.contact_info.whatsapp}
                onChange={(e) => setSettings({
                  ...settings,
                  contact_info: {
                    ...settings.contact_info,
                    whatsapp: e.target.value
                  }
                })}
                placeholder="5541999999999"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                type="email"
                value={settings.contact_info.email}
                onChange={(e) => setSettings({
                  ...settings,
                  contact_info: {
                    ...settings.contact_info,
                    email: e.target.value
                  }
                })}
                placeholder="contato@suaempresa.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Endereço
              </Label>
              <Input 
                value={settings.contact_info.address}
                onChange={(e) => setSettings({
                  ...settings,
                  contact_info: {
                    ...settings.contact_info,
                    address: e.target.value
                  }
                })}
                placeholder="Cidade, Estado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-primary" />
              Redes Sociais
            </CardTitle>
            <CardDescription>Links para suas redes sociais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input 
                value={settings.social_links.instagram}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: {
                    ...settings.social_links,
                    instagram: e.target.value
                  }
                })}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </Label>
              <Input 
                value={settings.social_links.facebook}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: {
                    ...settings.social_links,
                    facebook: e.target.value
                  }
                })}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Elo7
              </Label>
              <Input 
                value={settings.social_links.elo7}
                onChange={(e) => setSettings({
                  ...settings,
                  social_links: {
                    ...settings.social_links,
                    elo7: e.target.value
                  }
                })}
                placeholder="https://elo7.com.br/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Policy */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Política de Frete
            </CardTitle>
            <CardDescription>Configurações de entrega</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nota sobre Frete</Label>
              <Textarea 
                value={settings.shipping_policy.note}
                onChange={(e) => setSettings({
                  ...settings,
                  shipping_policy: {
                    ...settings.shipping_policy,
                    note: e.target.value
                  }
                })}
                placeholder="Mensagem exibida sobre o frete..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Esta mensagem será exibida na página do produto e no carrinho
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;