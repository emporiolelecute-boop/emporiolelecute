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

export interface SEOConfig {
  site_title: string;
  site_description: string;
  site_keywords: string;
  og_image: string;
  twitter_handle: string;
  google_verification: string;
  bing_verification: string;
  facebook_app_id: string;
  canonical_url: string;
  robots_txt: string;
  additional_meta_tags: string;
  structured_data_business: string;
  sitemap_notification_email: string;
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

const defaultSEOConfig: SEOConfig = {
  site_title: 'Empório LeleCute | Lembrancinhas Artesanais Personalizadas',
  site_description: 'Ateliê criativo de lembrancinhas artesanais personalizadas. Sabonetes, velas perfumadas e presentes únicos para todas as ocasiões especiais.',
  site_keywords: 'lembrancinhas personalizadas, sabonetes artesanais, velas perfumadas, maternidade, chá de bebê, batizado, casamento',
  og_image: 'https://img.elo7.com.br/users/banner/12A517D.jpg',
  twitter_handle: '@emporiolelecute',
  google_verification: '',
  bing_verification: '',
  facebook_app_id: '',
  canonical_url: 'https://emporiolelecute.com.br',
  robots_txt: '',
  additional_meta_tags: '',
  structured_data_business: '',
  sitemap_notification_email: '',
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

export const useSEOConfig = () => {
  return useQuery({
    queryKey: ['seo_config'],
    queryFn: async (): Promise<SEOConfig> => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'seo_config')
        .maybeSingle();

      if (error) {
        console.error('Error fetching SEO config:', error);
        return defaultSEOConfig;
      }

      if (data?.value && typeof data.value === 'object' && !Array.isArray(data.value)) {
        const val = data.value as Record<string, unknown>;
        return {
          site_title: typeof val.site_title === 'string' ? val.site_title : defaultSEOConfig.site_title,
          site_description: typeof val.site_description === 'string' ? val.site_description : defaultSEOConfig.site_description,
          site_keywords: typeof val.site_keywords === 'string' ? val.site_keywords : defaultSEOConfig.site_keywords,
          og_image: typeof val.og_image === 'string' ? val.og_image : defaultSEOConfig.og_image,
          twitter_handle: typeof val.twitter_handle === 'string' ? val.twitter_handle : defaultSEOConfig.twitter_handle,
          google_verification: typeof val.google_verification === 'string' ? val.google_verification : defaultSEOConfig.google_verification,
          bing_verification: typeof val.bing_verification === 'string' ? val.bing_verification : defaultSEOConfig.bing_verification,
          facebook_app_id: typeof val.facebook_app_id === 'string' ? val.facebook_app_id : defaultSEOConfig.facebook_app_id,
          canonical_url: typeof val.canonical_url === 'string' ? val.canonical_url : defaultSEOConfig.canonical_url,
          robots_txt: typeof val.robots_txt === 'string' ? val.robots_txt : defaultSEOConfig.robots_txt,
          additional_meta_tags: typeof val.additional_meta_tags === 'string' ? val.additional_meta_tags : defaultSEOConfig.additional_meta_tags,
          structured_data_business: typeof val.structured_data_business === 'string' ? val.structured_data_business : defaultSEOConfig.structured_data_business,
          sitemap_notification_email: typeof val.sitemap_notification_email === 'string' ? val.sitemap_notification_email : defaultSEOConfig.sitemap_notification_email,
        };
      }

      return defaultSEOConfig;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
