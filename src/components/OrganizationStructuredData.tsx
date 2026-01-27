import { Helmet } from 'react-helmet';

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
      "url": "https://img.elo7.com.br/users/banner/12A517D.jpg",
      "width": 600,
      "height": 60
    },
    "image": "https://img.elo7.com.br/users/banner/12A517D.jpg",
    "description": "Ateliê criativo de lembrancinhas artesanais personalizadas. Sabonetes, velas perfumadas e presentes únicos para maternidade, chá de bebê, batizado, casamento e aniversário.",
    "email": "contato@emporiolelecute.com.br",
    "telephone": "+55-41-99221-4299",
    "address": {
      "@type": "PostalAddress",
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
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "sameAs": [
      "https://www.instagram.com/emporiolelecute",
      "https://www.facebook.com/emporiolelecute",
      "https://www.elo7.com.br/emporiolelecute",
      "https://br.pinterest.com/emporiolelecute"
    ],
    "foundingDate": "2014",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 5
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+55-41-99221-4299",
        "contactType": "customer service",
        "areaServed": "BR",
        "availableLanguage": "Portuguese",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+55-41-99221-4299",
        "contactType": "sales",
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
