import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, Clock, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DynamicSEO from "@/components/DynamicSEO";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";
import { Button } from "@/components/ui/button";
import { getPostBySlug } from "@/data/blog";

const SITE = "https://emporiolelecute.com.br";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const url = `${SITE}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Empório LeleCute",
      logo: { "@type": "ImageObject", url: `${SITE}/favicon.ico` },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        url={url}
        image={post.coverImage}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Início", url: `${SITE}/` },
          { name: "Blog", url: `${SITE}/blog` },
          { name: post.title, url },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao blog
            </Link>

            <span className="text-xs uppercase tracking-wide text-primary font-medium">
              {post.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-foreground mt-2 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingMinutes} min de leitura
              </span>
            </div>

            {post.coverImage && (
              <div className="rounded-2xl overflow-hidden mb-8 bg-muted aspect-video">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-neutral max-w-none prose-headings:font-display prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* CTA pós-conteúdo */}
            <div className="mt-12 p-6 bg-gradient-to-br from-primary-light to-cream rounded-2xl text-center">
              <h2 className="font-display text-xl text-foreground mb-2">
                Quer lembrancinhas prontas e personalizadas?
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Atendimento direto com a artesã pelo WhatsApp.
              </p>
              <a
                href="https://wa.me/5541992214299?text=Ol%C3%A1!%20Vim%20pelo%20blog%20do%20Emp%C3%B3rio%20LeleCute."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Falar no WhatsApp
                </Button>
              </a>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
