import { Instagram, Heart, ExternalLink } from "lucide-react";

const InstagramFeed = () => {
  const posts = [
    { id: 1, image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg", alt: "Sabonete margarida artesanal" },
    { id: 2, image: "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg", alt: "Vela margarida perfumada" },
    { id: 3, image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg", alt: "Sabonete borboleta personalizado" },
    { id: 4, image: "https://img.elo7.com.br/product/685x685/5663EE8/lembrancinha-sabonete-brasao-2-letras.jpg", alt: "Sabonete brasão com letras" },
    { id: 5, image: "https://img.elo7.com.br/product/685x685/548BDE7/lembrancinha-sabonete-fundo-do-mar-letra-mini-coracao.jpg", alt: "Sabonete fundo do mar" },
    { id: 6, image: "https://img.elo7.com.br/product/685x685/576D279/sabonete-lembrancinha-natal-presepio-sagrada-familia-natal-presepio.jpg", alt: "Sabonete presépio natal" },
  ];

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
          {posts.map((post) => (
            <a key={post.id} href="https://www.instagram.com/emporiolelecute" target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden rounded-xl group">
              <img src={post.image} alt={post.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="https://www.instagram.com/emporiolelecute" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold shadow-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Instagram className="h-5 w-5" />
            Seguir no Instagram
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;