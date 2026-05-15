import { Helmet } from 'react-helmet';

const LocalBusinessStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://emporiolelecute.com.br/#localbusiness",
    "name": "Empório LeleCute",
    "image": "https://emporiolelecute.com.br/og-image.webp",
    "description": "Ateliê criativo de lembrancinhas artesanais personalizadas. Sabonetes, velas perfumadas e presentes únicos para maternidade, chá de bebê, batizado, casamento e aniversário.",
    "url": "https://emporiolelecute.com.br",
    "telephone": "+55-41-99221-4299",
    "email": "emporiolelecute@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São José dos Pinhais",
      "addressRegion": "PR",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -25.5314,
      "longitude": -49.2063
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "BRL",
    "paymentAccepted": "Cash, Credit Card, PIX",
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "sameAs": [
      "https://www.instagram.com/emporiolelecute",
      "https://www.facebook.com/emporiolelecute"
    ]
    // NOTE: aggregateRating removido — só pode ser adicionado quando houver reviews reais
    // exibidos na página (diretrizes Google), caso contrário gera manual action.
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessStructuredData;
