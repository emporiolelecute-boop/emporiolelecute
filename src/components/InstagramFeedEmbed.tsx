import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { useInstagramFeedEmbedsPublic } from "@/hooks/useInstagramFeedEmbeds";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_SRC = "https://www.instagram.com/embed.js";

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

interface Props {
  heading?: string;
  subheading?: string;
}

const InstagramFeedEmbed = ({
  heading = "Últimas postagens do Instagram",
  subheading = "@emporiolelecute",
}: Props) => {
  const { data: items = [] } = useInstagramFeedEmbedsPublic();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
    if (visible && items.length > 0) loadEmbedScript();
  }, [visible, items.length]);

  if (items.length === 0) return null;

  return (
    <section ref={ref} className="py-16 bg-background" aria-labelledby="ig-feed-embed">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
            <Instagram className="h-4 w-4" />
            {subheading}
          </span>
          <h2 id="ig-feed-embed" className="font-display text-3xl md:text-4xl text-foreground">
            {heading}
          </h2>
        </div>

        {visible && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={item.post_url}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: 0,
                    margin: 0,
                    padding: 0,
                    width: "100%",
                    minWidth: "auto",
                  }}
                >
                  <a href={item.post_url} target="_blank" rel="noopener noreferrer">
                    {item.caption || "Ver no Instagram"}
                  </a>
                </blockquote>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default InstagramFeedEmbed;
