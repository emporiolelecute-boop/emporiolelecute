import { Link } from "react-router-dom";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import { Button } from "@/components/ui/button";
import { getPublishedPosts } from "@/data/blog";

const SITE = "https://emporiolelecute.com.br";

const Blog = () => {
  const posts = getPublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Blog Empório LeleCute | Lembrancinhas Artesanais e DIY"
        description="Tutoriais, dicas e inspiração sobre sabonetes artesanais, lembrancinhas personalizadas e ideias para chá de bebê, maternidade, batizado e aniversário."
        url={`${SITE}/blog`}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Início", url: `${SITE}/` },
          { name: "Blog", url: `${SITE}/blog` },
        ]}
      />

      <Header />

      <main className="pt-24 pb-16">
        {/* HERO */}
        <section className="bg-gradient-to-br from-primary-light via-cream to-primary-light py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4 text-primary" />
              Blog
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
              Inspiração e tutoriais para suas lembrancinhas
            </h1>
            <p className="text-lg text-muted-foreground">
              Guias práticos, dicas de personalização e ideias para chá de bebê, maternidade, batizado, casamento e aniversário.
            </p>
          </div>
        </section>

        {/* LISTA DE POSTS */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl">
                <BookOpen className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-3">
                  Conteúdo a caminho
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Estamos preparando os primeiros artigos com tutoriais de sabonete artesanal e dicas para suas lembrancinhas. Volte em breve!
                </p>
                <Link to="/produtos">
                  <Button>Enquanto isso, conheça nossas lembrancinhas</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-card rounded-2xl overflow-hidden border border-border/40 hover:shadow-lg transition-all flex flex-col"
                  >
                    {post.coverImage && (
                      <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden bg-muted">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="text-xs uppercase tracking-wide text-primary font-medium mb-2">
                        {post.category}
                      </span>
                      <h2 className="font-display text-xl text-foreground mb-3">
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingMinutes} min
                        </span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4 hover:gap-2 transition-all"
                      >
                        Ler artigo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Blog;
