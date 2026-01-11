import { Helmet } from 'react-helmet';

interface ProductStructuredDataProps {
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  rating?: number;
  reviewCount?: number;
  productionDays?: number;
  category?: string;
  brand?: string;
}

const ProductStructuredData = ({
  name,
  description,
  price,
  images,
  slug,
  rating = 5,
  reviewCount = 10,
  productionDays = 7,
  category = "Lembrancinhas Artesanais",
  brand = "Empório LeleCute",
}: ProductStructuredDataProps) => {
  const baseUrl = "https://emporiolelecute.com.br";
  const productUrl = `${baseUrl}/produto/${slug}`;
  
  // Calculate availability date based on production days
  const availabilityDate = new Date();
  availabilityDate.setDate(availabilityDate.getDate() + productionDays);

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": images.length > 0 ? images : [`${baseUrl}/placeholder.svg`],
    "sku": slug,
    "mpn": slug.toUpperCase(),
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "url": productUrl,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "BRL",
      "price": price.toFixed(2),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": brand
      },
      // Fix: shippingDetails
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "BRL"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "BR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": productionDays,
            "maxValue": productionDays + 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 15,
            "unitCode": "DAY"
          }
        }
      },
      // Fix: hasMerchantReturnPolicy
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "BR",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
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

export default ProductStructuredData;