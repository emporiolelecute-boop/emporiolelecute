import { Helmet } from 'react-helmet-async';

const OrganizationStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://emporiolelecute.com.br/#organization",
    "name": "Empório LeleCute",
    "alternateName": "LeleCute",
    "url": "https://emporiolelecute.com.br",
    "logo": {
      "@type": "ImageObject",
      "url": "https://emporiolelecute.com.br/og-image.webp"
    },
    "image": "https://emporiolelecute.com.br/og-image.webp",
    "description": "Ateliê criativo de lembrancinhas artesanais personalizadas. Sabonetes, velas perfumadas e presentes únicos para maternidade, chá de bebê, batizado, casamento e aniversário.",
    "email": "emporiolelecute@gmail.com",
    "telephone": "+55-41-99221-4299",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São José dos Pinhais",
      "addressRegion": "PR",
      "addressCountry": "BR"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "sameAs": [
      "https://www.instagram.com/emporiolelecute",
      "https://www.facebook.com/emporiolelecute",
      "https://br.pinterest.com/emporiolelecute"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+55-41-99221-4299",
        "contactType": "customer service",
        "areaServed": "BR",
        "availableLanguage": "Portuguese"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default OrganizationStructuredData;
