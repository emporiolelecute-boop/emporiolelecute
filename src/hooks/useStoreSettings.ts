import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AcceptedMethods {
  pix: boolean;
  credit_card: boolean;
  boleto: boolean;
}

interface PaymentConfig {
  pix_discount: number;
  installments: number;
  accepted_methods: AcceptedMethods;
}

const defaultPaymentConfig: PaymentConfig = {
  pix_discount: 7,
  installments: 3,
  accepted_methods: {
    pix: true,
    credit_card: true,
    boleto: false,
  },
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
        const methods = val.accepted_methods as Record<string, unknown> | undefined;
        return {
          pix_discount: typeof val.pix_discount === 'number' ? val.pix_discount : defaultPaymentConfig.pix_discount,
          installments: typeof val.installments === 'number' ? val.installments : defaultPaymentConfig.installments,
          accepted_methods: {
            pix: typeof methods?.pix === 'boolean' ? methods.pix : defaultPaymentConfig.accepted_methods.pix,
            credit_card: typeof methods?.credit_card === 'boolean' ? methods.credit_card : defaultPaymentConfig.accepted_methods.credit_card,
            boleto: typeof methods?.boleto === 'boolean' ? methods.boleto : defaultPaymentConfig.accepted_methods.boleto,
          },
        };
      }

      return defaultPaymentConfig;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
