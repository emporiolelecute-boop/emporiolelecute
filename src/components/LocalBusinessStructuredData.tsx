import { Helmet } from 'react-helmet';

const LocalBusinessStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://emporiolelecute.com.br/#localbusiness",
    "name": "Empório LeleCute",
    "image": "https://img.elo7.com.br/users/banner/12A517D.jpg",
    "description": "Ateliê criativo de lembrancinhas artesanais personalizadas. Sabonetes, velas perfumadas e presentes únicos para maternidade, chá de bebê, batizado, casamento e aniversário.",
    "url": "https://emporiolelecute.com.br",
    "telephone": "+55-41-99221-4299",
    "email": "contato@emporiolelecute.com.br",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua do Ateliê",
      "addressLocality": "São José dos Pinhais",
      "addressRegion": "PR",
      "postalCode": "83010-000",
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
      "https://www.facebook.com/emporiolelecute",
      "https://www.elo7.com.br/emporiolelecute"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "reviewCount": 5000,
      "bestRating": 5,
      "worstRating": 1
    }
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
