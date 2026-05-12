import { Link } from "react-router-dom";
import { useHomepageBlocks } from "@/hooks/useHomepageBlocks";
import { Skeleton } from "@/components/ui/skeleton";
import sabonetesImg from "@/assets/category-sabonetes.webp";
import velasImg from "@/assets/category-velas.webp";
import kitsImg from "@/assets/category-kits.webp";
import lembrancinhasImg from "@/assets/category-lembrancinhas.webp";

const defaultCategories = [
  { name: "Sabonetes", image: sabonetesImg, link: "/produtos?categoria=sabonetes" },
  { name: "Velas", image: velasImg, link: "/produtos?categoria=velas" },
  { name: "Kits Maternidade", image: kitsImg, link: "/produtos?categoria=kits" },
  { name: "Lembrancinhas", image: lembrancinhasImg, link: "/produtos?categoria=lembrancinhas" },
];

const CategoriesHighlight = () => {
  const { data: blocks, isLoading } = useHomepageBlocks('category');

  const categories = blocks && blocks.length > 0
    ? blocks.map(block => ({
        name: block.title,
        image: block.image_url || '',
        link: block.link_url || '/produtos',
        linkText: block.link_text || 'Comprar Agora',
      }))
    : defaultCategories.map(c => ({ ...c, linkText: 'Comprar Agora' }));

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="sr-only">Empório LeleCute - Lembrancinhas Artesanais Personalizadas</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* SEO H1 - visually hidden but present for search engines */}
        <h1 className="sr-only">Empório LeleCute - Lembrancinhas Artesanais Personalizadas</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={category.link}
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
                <h2 className="font-display text-lg md:text-xl text-white mb-1">
                  {category.name}
                </h2>
                <span className="text-primary-light text-sm font-medium group-hover:text-primary transition-colors">
                  {category.linkText}
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