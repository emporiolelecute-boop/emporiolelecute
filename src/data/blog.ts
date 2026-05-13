/**
 * Estrutura inicial do blog do Empório LeleCute (Horizonte 2 — Fase 2).
 *
 * Os posts ficam aqui em código por enquanto. Quando o volume justificar,
 * migrar para tabela `blog_posts` no banco com CMS no admin.
 *
 * Para publicar um post: adicionar entry em BLOG_POSTS com `published: true`.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown ou HTML simples renderizado em <article> */
  contentHtml: string;
  coverImage?: string;
  author: string;
  publishedAt: string; // ISO date
  updatedAt?: string;
  /** Tempo estimado de leitura, em minutos */
  readingMinutes: number;
  category: string;
  tags: string[];
  /** SEO */
  seoTitle?: string;
  seoDescription?: string;
  /** Se false, o post não é renderizado nem incluído no sitemap */
  published: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-fazer-sabonete-artesanal-para-lembrancinhas",
    title: "Como fazer sabonete artesanal para lembrancinhas",
    excerpt:
      "Guia completo para produzir sabonetes artesanais perfeitos para lembrancinhas: materiais, passo a passo, dicas de aroma, embalagem e personalização.",
    contentHtml: `
      <p><em>Conteúdo em produção. Em breve publicaremos o guia completo com passo a passo, lista de materiais, dicas de fragrância e técnicas de embalagem.</em></p>
    `,
    coverImage: undefined,
    author: "Empório LeleCute",
    publishedAt: "2026-05-13",
    readingMinutes: 8,
    category: "Tutoriais",
    tags: ["sabonete artesanal", "lembrancinhas", "DIY"],
    seoTitle: "Como Fazer Sabonete Artesanal para Lembrancinhas | Guia Completo",
    seoDescription:
      "Aprenda passo a passo como fazer sabonete artesanal para lembrancinhas: materiais, processo, aromatização e embalagem personalizada.",
    published: false, // ainda em rascunho — será ativado ao publicar o conteúdo
  },
];

export const getPublishedPosts = () => BLOG_POSTS.filter((p) => p.published);

export const getPostBySlug = (slug: string) =>
  BLOG_POSTS.find((p) => p.slug === slug && p.published);
