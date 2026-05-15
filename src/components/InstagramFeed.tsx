import { Instagram, Heart, ExternalLink } from "lucide-react";
import { useInstagramPosts } from "@/hooks/useInstagramPosts";
import { BlurImage } from "@/components/BlurImage";
import { Skeleton } from "@/components/ui/skeleton";
import sabonetesImg from "@/assets/category-sabonetes.webp";
import velasImg from "@/assets/category-velas.webp";
import lembrancinhasImg from "@/assets/category-lembrancinhas.webp";
import kitsImg from "@/assets/category-kits.webp";

const fallbackPosts = [
  { id: "f1", image_url: sabonetesImg, alt_text: "Sabonetes artesanais", post_url: "https://www.instagram.com/emporiolelecute" },
  { id: "f2", image_url: velasImg, alt_text: "Velas perfumadas", post_url: "https://www.instagram.com/emporiolelecute" },
  { id: "f3", image_url: lembrancinhasImg, alt_text: "Lembrancinhas em caixinhas", post_url: "https://www.instagram.com/emporiolelecute" },
  { id: "f4", image_url: kitsImg, alt_text: "Kits maternidade", post_url: "https://www.instagram.com/emporiolelecute" },
  { id: "f5", image_url: sabonetesImg, alt_text: "Sabonetes florais", post_url: "https://www.instagram.com/emporiolelecute" },
  { id: "f6", image_url: velasImg, alt_text: "Velas aromáticas", post_url: "https://www.instagram.com/emporiolelecute" },
];

const InstagramFeed = () => {
  const { data: dbPosts, isLoading } = useInstagramPosts();
  
  // Limita a 6 postagens como solicitado
  const posts = dbPosts && dbPosts.length > 0 
    ? dbPosts.slice(0, 6) 
    : fallbackPosts.slice(0, 6);

  return (
    <section className="py-20 bg-background" aria-labelledby="instagram-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-medium mb-4">
            <Instagram className="h-4 w-4" />
            @emporiolelecute
          </span>
          <h2 id="instagram-heading" className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Siga-nos no <span className="text-primary">Instagram</span>
          </h2>
          <p className="text-muted-foreground">Acompanhe novidades, bastidores e inspirações</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {isLoading ? (
            // Skeleton Loading
            [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl w-full" />
            ))
          ) : (
            posts.map((post) => (
              <a
                key={post.id}
                href={post.post_url || "https://www.instagram.com/emporiolelecute"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={post.alt_text || "Postagem do Instagram"}
                className="relative aspect-square overflow-hidden rounded-xl group bg-muted/30 block shadow-soft"
              >
                <BlurImage
                  src={post.image_url}
                  alt={post.alt_text || "Instagram Post"}
                  width={400}
                  responsiveWidths={[200, 300, 400]}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/emporiolelecute"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <Instagram className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            Ver Perfil Completo
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
