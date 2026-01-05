import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PaymentConfig {
  pix_discount: number;
  installments: number;
}

interface StoreSettings {
  payment_config: PaymentConfig;
}

const defaultPaymentConfig: PaymentConfig = {
  pix_discount: 7,
  installments: 3,
};

export const usePaymentConfig = () => {
  return useQuery({
    queryKey: ['payment_config'],
    queryFn: async (): Promise<PaymentConfig> => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'payment_config')
        .maybeSingle();

      if (error) {
        console.error('Error fetching payment config:', error);
        return defaultPaymentConfig;
      }

      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        const val = data.value as Record<string, unknown>;
        return {
          pix_discount: typeof val.pix_discount === 'number' ? val.pix_discount : defaultPaymentConfig.pix_discount,
          installments: typeof val.installments === 'number' ? val.installments : defaultPaymentConfig.installments,
        };
      }

      return defaultPaymentConfig;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
