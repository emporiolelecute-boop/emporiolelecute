import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Search, 
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Customer {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_city: string;
  address_state: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
}

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Fetch aggregated customer data from orders
  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name, customer_email, customer_phone, address_city, address_state, total, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Aggregate by email
      const customerMap = new Map<string, Customer>();
      
      data.forEach(order => {
        const existing = customerMap.get(order.customer_email);
        if (existing) {
          existing.total_orders += 1;
          existing.total_spent += order.total;
          if (new Date(order.created_at) > new Date(existing.last_order_date)) {
            existing.last_order_date = order.created_at;
          }
        } else {
          customerMap.set(order.customer_email, {
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone,
            address_city: order.address_city,
            address_state: order.address_state,
            total_orders: 1,
            total_spent: order.total,
            last_order_date: order.created_at,
          });
        }
      });

      return Array.from(customerMap.values()).sort((a, b) => 
        new Date(b.last_order_date).getTime() - new Date(a.last_order_date).getTime()
      );
    },
  });

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_phone.includes(searchTerm);
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Stats
  const totalCustomers = customers?.length || 0;
  const totalRevenue = customers?.reduce((sum, c) => sum + c.total_spent, 0) || 0;
  const avgOrderValue = totalCustomers > 0 ? totalRevenue / (customers?.reduce((sum, c) => sum + c.total_orders, 0) || 1) : 0;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Clientes
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualize os dados dos clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">{totalCustomers}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Receita Total</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-foreground">{formatCurrency(avgOrderValue)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Ticket Médio</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCustomers && filteredCustomers.length > 0 ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Cliente</th>
                  <th className="text-left p-4 font-medium text-foreground">Localização</th>
                  <th className="text-left p-4 font-medium text-foreground">Pedidos</th>
                  <th className="text-left p-4 font-medium text-foreground">Total Gasto</th>
                  <th className="text-left p-4 font-medium text-foreground">Último Pedido</th>
                  <th className="text-right p-4 font-medium text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{customer.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{customer.customer_email}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">
                        {customer.address_city} - {customer.address_state}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{customer.total_orders} pedidos</Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(customer.total_spent)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(customer.last_order_date)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum cliente encontrado</h3>
          <p className="text-muted-foreground">Os clientes aparecerão aqui quando fizerem pedidos.</p>
        </div>
      )}

      {/* Customer Details Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              Detalhes do Cliente
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {selectedCustomer.customer_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-display text-xl text-foreground">{selectedCustomer.customer_name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedCustomer.customer_email}`} className="text-sm text-primary hover:underline">
                      {selectedCustomer.customer_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <a href={`tel:${selectedCustomer.customer_phone}`} className="text-sm text-primary hover:underline">
                      {selectedCustomer.customer_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Localização</p>
                    <p className="text-sm text-foreground">
                      {selectedCustomer.address_city} - {selectedCustomer.address_state}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{selectedCustomer.total_orders}</p>
                    <p className="text-xs text-muted-foreground">Pedidos</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(selectedCustomer.total_spent)}</p>
                    <p className="text-xs text-muted-foreground">Total Gasto</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Último Pedido</p>
                    <p className="text-sm text-foreground">
                      {formatDate(selectedCustomer.last_order_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={`https://wa.me/55${selectedCustomer.customer_phone.replace(/\D/g, '')}?text=Olá ${selectedCustomer.customer_name}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a href={`mailto:${selectedCustomer.customer_email}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
