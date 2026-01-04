import { Link } from "react-router-dom";

const categories = [
  {
    name: "Sabonetes",
    image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
    slug: "sabonetes",
  },
  {
    name: "Velas",
    image: "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg",
    slug: "velas",
  },
  {
    name: "Kits Maternidade",
    image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
    slug: "kits",
  },
  {
    name: "Lembrancinhas",
    image: "https://img.elo7.com.br/product/685x685/5663EE8/lembrancinha-sabonete-brasao-2-letras.jpg",
    slug: "lembrancinhas",
  },
];

const CategoriesHighlight = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              to={`/produtos?categoria=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <img 
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-lg md:text-xl text-white mb-1">
                  {category.name}
                </h3>
                <span className="text-primary-light text-sm font-medium group-hover:text-primary transition-colors">
                  Comprar Agora
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesHighlight;