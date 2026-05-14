import { useFooterConfig } from '@/hooks/useStoreSettings';

/**
 * Centralized helper for contact channels (WhatsApp, instagram, etc.)
 * Reads from store_settings.footer_config (publicly readable) so admins can
 * edit the WhatsApp number, link and default messages from the admin panel.
 */
export const useContactInfo = () => {
  const { data: footer } = useFooterConfig();

  const rawPhone = footer?.contacts?.phone || '(41) 99221-4299';
  // Strip non-digits, prepend Brazil country code if missing
  const digits = rawPhone.replace(/\D/g, '');
  const whatsappNumber = digits.startsWith('55') ? digits : `55${digits}`;

  const buildWhatsappUrl = (message: string) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return {
    phone: rawPhone,
    whatsappNumber,
    buildWhatsappUrl,
    instagram: footer?.social_links?.instagram || 'https://www.instagram.com/emporiolelecute',
    facebook: footer?.social_links?.facebook || 'https://www.facebook.com/emporiolelecute',
  };
};
