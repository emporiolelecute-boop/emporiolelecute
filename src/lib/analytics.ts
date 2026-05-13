import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics
export const GA_TRACKING_ID = "G-XXXXXXXXXX"; // Replace with actual ID

export const initGA = () => {
  if (typeof window === "undefined") return;
  
  // Load Google Analytics script
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, params: Record<string, any>) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, params);
  }
};

// Facebook Pixel
export const FB_PIXEL_ID = "XXXXXXXXXXXXXXX"; // Replace with actual ID

export const initFBPixel = () => {
  if (typeof window === "undefined") return;

  // Load Facebook Pixel script
  const script = document.createElement("script");
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
};

export const fbEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window.fbq !== "undefined") {
    window.fbq("track", eventName, params);
  }
};

// Track product view
export const trackProductView = (productName: string, productId: string, price: string) => {
  event("view_item", {
    currency: "BRL",
    value: parseFloat(price.replace("R$ ", "").replace(",", ".")),
    items: [{ item_id: productId, item_name: productName }],
  });
  
  fbEvent("ViewContent", {
    content_name: productName,
    content_ids: [productId],
    content_type: "product",
    value: parseFloat(price.replace("R$ ", "").replace(",", ".")),
    currency: "BRL",
  });
};

// Track add to cart / inquiry
export const trackInquiry = (productName: string, productId: string) => {
  event("generate_lead", {
    currency: "BRL",
    items: [{ item_id: productId, item_name: productName }],
  });
  
  fbEvent("Lead", {
    content_name: productName,
    content_ids: [productId],
  });
};

// Track form submission
export const trackFormSubmission = (formType: string) => {
  event("form_submission", {
    form_type: formType,
  });
  
  fbEvent("Contact", {
    content_category: formType,
  });
};

/**
 * Track internal navigation between key SEO surfaces (catalog ↔ landings ↔ blog).
 * Used to measure silo effectiveness and which interlinks drive engagement.
 */
export const trackInternalLink = (params: {
  from: string;       // origin route, e.g. "/produtos"
  to: string;         // destination route, e.g. "/lembrancinhas-maternidade"
  label: string;      // human-readable link label
  position?: string;  // optional location on the page (e.g. "silo_grid", "reading_route_step_2")
}) => {
  event("internal_link_click", {
    link_from: params.from,
    link_to: params.to,
    link_label: params.label,
    link_position: params.position || "default",
  });
};

// Hook to track page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
    
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "PageView");
    }
  }, [location]);
};
