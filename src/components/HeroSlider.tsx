import { useState, useEffect } from "react";
import { Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import TrustBadges from "@/components/TrustBadges";
import { Button } from "@/components/ui/button";
import { useHeroSlides, type HeroSlide } from "@/hooks/useHeroSlides";
import { useIsMobile } from "@/hooks/use-mobile";
import sabonetesImg from "@/assets/category-sabonetes.webp";
import lembrancinhasImg from "@/assets/category-lembrancinhas.webp";
import kitsImg from "@/assets/category-kits.webp";

// ---------------------------------------------------------------------------
// Fallback slides — usados apenas quando não há slides cadastrados no banco
// ---------------------------------------------------------------------------
const fallbackSlides: HeroSlide[] = [
  {
    id: 'f1',
    display_mode: 'text_image',
    tagline: "Para qualquer idade e ocasião",
    title: "Lembrancinhas de qualidade premium",
    subtitle: "Cada produto é feito sob encomenda com ingredientes naturais e embalagem especial.",
    image_url: sabonetesImg,
    image_mobile_url: null,
    image_desktop_url: null,
    image_alt: "Sabonetes artesanais personalizados Empório LeleCute",
    cta_label: null,
    cta_url: null,
    position: 0,
    is_visible: true,
  },
  {
    id: 'f2',
    display_mode: 'text_image',
    tagline: "Ateliê Criativo",
    title: "Lembrancinhas Artesanais que Perfumam seus Momentos",
    subtitle: "Sabonetes artesanais, velas perfumadas e presentes personalizados feitos com amor e carinho.",
    image_url: lembrancinhasImg,
    image_mobile_url: null,
    image_desktop_url: null,
    image_alt: "Lembrancinhas artesanais personalizadas Empório LeleCute",
    cta_label: null,
    cta_url: null,
    position: 1,
    is_visible: true,
  },
  {
    id: 'f3',
    display_mode: 'text_image',
    tagline: "100% Personalizado",
    title: "Sua celebração com um toque especial",
    subtitle: "Cores, aromas, embalagens e tags personalizadas para seu evento perfeito.",
    image_url: kitsImg,
    image_mobile_url: null,
    image_desktop_url: null,
    image_alt: "Kits de lembrancinhas personalizados Empório LeleCute",
    cta_label: null,
    cta_url: null,
    position: 2,
    is_visible: true,
  },
];

// Resolve asset paths that may have been stored as dev-time paths
const fallbackImageMap: Record<string, string> = {
  '/src/assets/category-sabonetes.webp': sabonetesImg,
  '/src/assets/category-lembrancinhas.webp': lembrancinhasImg,
  '/src/assets/category-kits.webp': kitsImg,
};

const resolveImageSrc = (src?: string | null) =>
  (src && fallbackImageMap[src]) || src || "";

const resolveSlideDisplay = (slide: HeroSlide, isMobile: boolean) => {
  const mobileSrc = resolveImageSrc(slide.image_mobile_url);
  const desktopSrc = resolveImageSrc(slide.image_desktop_url);

  if (isMobile && mobileSrc) {
    return { mode: "banner_mobile" as const, imgSrc: mobileSrc };
  }

  if (!isMobile && desktopSrc) {
    return { mode: "banner_desktop" as const, imgSrc: desktopSrc };
  }

  return {
    mode: "text_image" as const,
    imgSrc: resolveImageSrc(slide.image_url) || sabonetesImg,
  };
};

// ---------------------------------------------------------------------------
// Sub-components for each display mode
// ---------------------------------------------------------------------------

/** Modo 1 — texto à esquerda + imagem quadrada à direita */
function SlideTextImage({
  slide,
  isPriority,
  imgSrc,
}: {
  slide: HeroSlide;
  isPriority: boolean;
  imgSrc: string;
}) {
  const alt = slide.image_alt || slide.title;

  return (
    <div className="container mx-auto px-4 relative z-10 py-10 md:py-16 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Text column */}
        <div className="max-w-xl">
          <div className="animate-fade-in">
            {slide.tagline && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">{slide.tagline}</span>
              </div>
            )}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {slide.subtitle}
              </p>
            )}
            {slide.cta_label && slide.cta_url && (
              <a href={slide.cta_url} className="inline-block mb-8">
                <Button size="lg" className="rounded-full px-8">
                  {slide.cta_label}
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Image column */}
        <div className="relative flex justify-center items-center">
          <div className="absolute -bottom-4 right-8 lg:right-16 text-primary z-10">
            <Heart className="h-10 w-10 fill-primary/20 animate-float" />
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-scale-in max-w-md lg:max-w-lg w-full">
            <img
              src={imgSrc}
              alt={alt}
              width={600}
              height={600}
              loading={isPriority ? "eager" : "lazy"}
              // @ts-expect-error fetchpriority is valid HTML
              fetchpriority={isPriority ? "high" : "auto"}
              decoding="async"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Modo 2 — banner full-width, visível apenas em mobile/tablet (< md) */
function SlideBannerMobile({
  slide,
  isPriority,
  imgSrc,
}: {
  slide: HeroSlide;
  isPriority: boolean;
  imgSrc: string;
}) {
  const alt = slide.image_alt || slide.title;

  if (!imgSrc) return null;

  return (
    // hidden on md+ (desktop)
    <div className="block md:hidden w-full animate-fade-in">
      <img
        src={imgSrc}
        alt={alt}
        loading={isPriority ? "eager" : "lazy"}
        // @ts-expect-error fetchpriority is valid HTML
        fetchpriority={isPriority ? "high" : "auto"}
        decoding="async"
        className="w-full h-auto block"
        style={{ maxWidth: "100%", display: "block" }}
      />
    </div>
  );
}

/** Modo 3 — banner full-width, visível apenas em desktop (≥ md) */
function SlideBannerDesktop({
  slide,
  isPriority,
  imgSrc,
}: {
  slide: HeroSlide;
  isPriority: boolean;
  imgSrc: string;
}) {
  const alt = slide.image_alt || slide.title;

  if (!imgSrc) return null;

  return (
    // hidden on mobile (< md)
    <div className="hidden md:block w-full animate-fade-in">
      <img
        src={imgSrc}
        alt={alt}
        loading={isPriority ? "eager" : "lazy"}
        // @ts-expect-error fetchpriority is valid HTML
        fetchpriority={isPriority ? "high" : "auto"}
        decoding="async"
        className="w-full h-auto block"
        style={{ maxWidth: "100%", display: "block" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main HeroSlider
// ---------------------------------------------------------------------------

const HeroSlider = () => {
  const { data: dbSlides } = useHeroSlides();
  const isMobile = useIsMobile();
  const slides: HeroSlide[] =
    dbSlides && dbSlides.length > 0 ? dbSlides : fallbackSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  const slide = slides[currentSlide] ?? slides[0];
  if (!slide) return null;
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const isPriority = currentSlide === 0;
  const display = resolveSlideDisplay(slide, isMobile);
  const mobileBannerSrc = resolveImageSrc(slide.image_mobile_url);
  const desktopBannerSrc = resolveImageSrc(slide.image_desktop_url);
  const fallbackSrc = resolveImageSrc(slide.image_url) || sabonetesImg;
  const hasAnyBanner = Boolean(mobileBannerSrc || desktopBannerSrc);
  const isBanner = hasAnyBanner;

  return (
    <section
      id="inicio"
      className="relative flex flex-col justify-center overflow-hidden bg-background"
      // Banner modes: no top padding (image starts right after header)
      // text_image mode: keeps the original spacing
      style={isBanner ? { paddingTop: "var(--header-height, 80px)" } : undefined}
      aria-label="Seção principal - Empório LeleCute"
    >
      {/* Decorative background — only for text_image mode */}
      {display.mode === "text_image" && (
        <>
          <div className="absolute inset-0 bg-dotted-pattern opacity-30 pointer-events-none" />
          <div className="absolute top-32 right-[15%] text-amber-400 pointer-events-none">
            <Sparkles className="h-8 w-8 animate-pulse-slow" fill="currentColor" />
          </div>
        </>
      )}

      {/* Slide content — render responsive banners with CSS so mobile never waits for JS breakpoint detection */}
      <div key={`${slide.id}-${hasAnyBanner ? "responsive-banner" : "text_image"}`} className="w-full">
        {hasAnyBanner ? (
          <>
            {mobileBannerSrc ? (
              <SlideBannerMobile slide={slide} isPriority={isPriority} imgSrc={mobileBannerSrc} />
            ) : (
              <div className="block md:hidden pt-20 pb-10">
                <SlideTextImage slide={slide} isPriority={isPriority} imgSrc={fallbackSrc} />
              </div>
            )}
            {desktopBannerSrc ? (
              <SlideBannerDesktop slide={slide} isPriority={isPriority} imgSrc={desktopBannerSrc} />
            ) : (
              <div className="hidden md:block pt-20 pb-10 md:pb-14">
                <SlideTextImage slide={slide} isPriority={isPriority} imgSrc={fallbackSrc} />
              </div>
            )}
          </>
        ) : (
          <div className="pt-20 pb-10 md:pb-14">
            <SlideTextImage slide={slide} isPriority={isPriority} imgSrc={fallbackSrc} />
          </div>
        )}
      </div>

      {/* Navigation dots + arrows — shown when there are multiple slides */}
      {slides.length > 1 && (
        <>
          {/* Dots */}
          <div
            className={`flex items-center justify-center gap-3 ${
              isBanner ? "py-3" : "pb-4"
            } relative z-10`}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary w-10"
                    : "bg-primary/30 w-3 hover:bg-primary/50"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <TrustBadges className="mt-6 md:mt-10" />
    </section>
  );
};

export default HeroSlider;
