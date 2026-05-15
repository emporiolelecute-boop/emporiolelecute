import { useEffect, useRef, useState } from "react";
import { Instagram, ExternalLink } from "lucide-react";
import { useInstagramFeedEmbedsPublic } from "@/hooks/useInstagramFeedEmbeds";
import { useInstagramFeedConfig } from "@/hooks/useInstagramFeedConfig";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_SRC = "https://www.instagram.com/embed.js";
const FALLBACK_TIMEOUT_MS = 6000;

const loadEmbedScript = () => {
  if (typeof window === "undefined") return;
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = SCRIPT_SRC;
  s.onload = () => window.instgrm?.Embeds.process();
  document.body.appendChild(s);
};

interface EmbedCardProps {
  url: string;
  caption: string | null;
  previewImageUrl?: string | null;
}

const EmbedCard = ({ url, caption, previewImageUrl }: EmbedCardProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    const t = window.setTimeout(() => {
      const hasIframe = wrapperRef.current?.querySelector("iframe");
      if (!hasIframe) {
        setFailed(true);
        void supabase.from("instagram_embed_failures").insert({
          post_url: url,
          route: typeof location !== "undefined" ? location.pathname : null,
          ms_to_fallback: Date.now() - startedAt,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
        });
      }
    }, FALLBACK_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [url]);

  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow h-full group"
      >
        {previewImageUrl ? (
          <div className="relative aspect-square bg-muted">
            <img
              src={previewImageUrl}
              alt={caption || "Postagem do Instagram"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
                Ver no Instagram <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <Instagram className="absolute top-3 right-3 h-6 w-6 text-white drop-shadow" />
          </div>
        ) : (
          <div className="p-6 min-h-[280px] flex flex-col items-center justify-center gap-3 text-center">
            <Instagram className="h-10 w-10 text-primary" />
            <p className="text-sm text-muted-foreground line-clamp-3">
              {caption || "Veja esta postagem no Instagram"}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
              Ver no Instagram <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        )}
        {previewImageUrl && caption && (
          <p className="text-sm text-muted-foreground line-clamp-2 p-3">{caption}</p>
        )}
      </a>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, margin: 0, padding: 0, width: "100%", minWidth: "auto" }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {caption || "Ver no Instagram"}
        </a>
      </blockquote>
    </div>
  );
};

const InstagramFeedEmbed = () => {
  const { data: items = [] } = useInstagramFeedEmbedsPublic();
  const { data: cfg } = useInstagramFeedConfig();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const max = Math.min(12, Math.max(1, cfg?.visible_count ?? 6));
  const shown = items.slice(0, max);

  useEffect(() => {
    if (!ref.current || visible) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible]);

  useEffect(() => {
    if (visible && shown.length > 0) loadEmbedScript();
  }, [visible, shown.length]);

  if (shown.length === 0) return null;

  return (
    <section ref={ref} className="py-16 bg-background" aria-labelledby="ig-feed-embed">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
            <Instagram className="h-4 w-4" />
            {cfg?.subheading || "@emporiolelecute"}
          </span>
          <h2 id="ig-feed-embed" className="font-display text-3xl md:text-4xl text-foreground">
            {cfg?.heading || "Últimas postagens do Instagram"}
          </h2>
          {cfg?.description && (
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">{cfg.description}</p>
          )}
        </div>

        {visible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((item) => (
              <EmbedCard key={item.id} url={item.post_url} caption={item.caption} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramFeedEmbed;
