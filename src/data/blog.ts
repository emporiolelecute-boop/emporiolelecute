/**
 * Blog do Empório LeleCute (Horizonte 2 — Fase 2).
 *
 * Os posts ficam aqui em código por enquanto. Quando o volume justificar,
 * migrar para tabela `blog_posts` no banco com CMS no admin.
 *
 * Para publicar/despublicar um post, alterar o flag `published`.
 * Cada post deve linkar internamente para pelo menos uma landing
 * /lembrancinhas-* e para /produtos, formando o silo SEO.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** HTML simples renderizado em <article> (Tailwind `prose`) */
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
  /** Slugs de outros posts relacionados (sugestões de leitura) */
  relatedSlugs?: string[];
  /** Se false, o post não é renderizado nem incluído no sitemap */
  published: boolean;
}

const AUTHOR = "Empório LeleCute";

export const BLOG_POSTS: BlogPost[] = [
  // ────────────────────────────────────────────────────────────────
  // POST 1 — PILAR / TUTORIAL (suporta todas as 6 landings)
  // ────────────────────────────────────────────────────────────────
  {
    slug: "como-fazer-sabonete-artesanal-para-lembrancinhas",
    title: "Como fazer sabonete artesanal para lembrancinhas: guia completo",
    excerpt:
      "Passo a passo para produzir sabonetes artesanais perfeitos para lembrancinhas: materiais, técnicas, aromas, formas e dicas de embalagem personalizada.",
    seoTitle: "Como Fazer Sabonete Artesanal para Lembrancinhas | Passo a Passo",
    seoDescription:
      "Guia completo: aprenda como fazer sabonete artesanal para lembrancinhas — materiais, processo, fragrâncias, formas e embalagem personalizada.",
    publishedAt: "2026-05-13",
    readingMinutes: 9,
    category: "Tutoriais",
    tags: ["sabonete artesanal", "lembrancinhas", "DIY", "passo a passo"],
    author: AUTHOR,
    published: true,
    relatedSlugs: [
      "lembrancinhas-maternidade-ideias-criativas",
      "cha-de-bebe-e-cha-revelacao-lembrancinhas",
      "lembrancinhas-batizado-aniversario-formatura",
    ],
    contentHtml: `
      <p>O sabonete artesanal é uma das lembrancinhas mais queridas — combina utilidade, estética e a possibilidade de personalização total. Neste guia mostramos o passo a passo que usamos no <strong>Empório LeleCute</strong> para produzir sabonetes para <a href="/lembrancinhas-maternidade">maternidade</a>, <a href="/lembrancinhas-cha-de-bebe">chá de bebê</a>, <a href="/lembrancinhas-batizado">batizado</a> e outras celebrações.</p>

      <h2>1. Materiais que você vai precisar</h2>
      <ul>
        <li><strong>Base de glicerina</strong> (transparente ou branca) — 500g rendem cerca de 10 a 15 sabonetes pequenos.</li>
        <li><strong>Essências cosméticas</strong> hidrossolúveis (lavanda, baunilha, talco, algodão).</li>
        <li><strong>Corantes líquidos</strong> próprios para sabonete.</li>
        <li><strong>Formas de silicone</strong> no formato desejado (coração, ursinho, flor, cruz).</li>
        <li>Álcool 70% em borrifador (para eliminar bolhas).</li>
        <li>Recipiente de vidro, colher e luvas.</li>
      </ul>

      <h2>2. Passo a passo</h2>
      <ol>
        <li><strong>Derreta</strong> a base de glicerina em banho-maria ou micro-ondas (intervalos de 30s, mexendo).</li>
        <li><strong>Adicione</strong> 1 colher de chá de essência e 2–3 gotas de corante para cada 100g de base.</li>
        <li><strong>Despeje</strong> nas formas com cuidado e borrife álcool 70% por cima para tirar bolhas.</li>
        <li><strong>Espere</strong> de 30 a 60 minutos até endurecer e desenforme com delicadeza.</li>
        <li><strong>Embale</strong> em saquinhos de celofane, organza ou caixinhas com tag personalizada.</li>
      </ol>

      <h2>3. Dicas para um acabamento profissional</h2>
      <ul>
        <li>Use <strong>essências leves</strong> (talco, algodão, lavanda) para lembrancinhas de bebê — agradam todos os públicos.</li>
        <li>Combine cores em <strong>paletas suaves</strong> (rosa-bebê, azul-céu, off-white) para um visual mais elegante.</li>
        <li>Para <strong>chá revelação</strong>, faça metade rosa e metade azul e finalize com tag "menino ou menina?".</li>
        <li>Adicione uma <strong>tag personalizada</strong> com nome do bebê / homenageado e a data — é o detalhe que mais encanta.</li>
      </ul>

      <h2>4. Quando vale a pena fazer e quando vale a pena encomendar</h2>
      <p>Fazer em casa funciona muito bem para <strong>quantidades pequenas</strong> (até 20 unidades) e quando a anfitriã tem tempo para experimentar. Para volumes maiores, prazos curtos ou acabamento profissional com tags, embalagens e testes de fragrância, é mais econômico e seguro <a href="/produtos">encomendar lembrancinhas prontas</a> com a artesã.</p>

      <h2>5. Inspirações por ocasião</h2>
      <ul>
        <li><a href="/lembrancinhas-maternidade">Lembrancinhas de Maternidade</a> — kits perfumados para receber as visitas do bebê.</li>
        <li><a href="/lembrancinhas-cha-de-bebe">Chá de Bebê</a> — sabonetes em formato de ursinho, mamadeira e coração.</li>
        <li><a href="/lembrancinhas-cha-revelacao">Chá Revelação</a> — combinações rosa e azul até o grande momento.</li>
        <li><a href="/lembrancinhas-batizado">Batizado</a> — sabonetes em formato de cruz, anjo e terço.</li>
        <li><a href="/lembrancinhas-aniversario-infantil">Aniversário Infantil</a> — temas e personagens favoritos da criança.</li>
        <li><a href="/lembrancinhas-formatura">Formatura</a> — capelo, diploma e cores da turma.</li>
      </ul>

      <p><em>Quer pular a parte da produção e focar só em receber elogios? Veja nosso <a href="/produtos">catálogo completo de sabonetes personalizados</a> ou fale direto com a artesã pelo WhatsApp.</em></p>
    `,
  },

  // ────────────────────────────────────────────────────────────────
  // POST 2 — MATERNIDADE
  // ────────────────────────────────────────────────────────────────
  {
    slug: "lembrancinhas-maternidade-ideias-criativas",
    title: "Lembrancinhas de Maternidade: 12 ideias criativas e econômicas",
    excerpt:
      "Descubra 12 ideias de lembrancinhas de maternidade que encantam as visitas, cabem no orçamento e podem ser personalizadas com o nome do bebê.",
    seoTitle: "Lembrancinhas de Maternidade: 12 Ideias Criativas e Econômicas",
    seoDescription:
      "12 ideias de lembrancinhas de maternidade lindas e econômicas: sabonetes, velas, sachês e kits personalizados com o nome do bebê.",
    publishedAt: "2026-05-13",
    readingMinutes: 6,
    category: "Inspiração",
    tags: ["maternidade", "lembrancinhas", "bebê"],
    author: AUTHOR,
    published: true,
    relatedSlugs: [
      "como-fazer-sabonete-artesanal-para-lembrancinhas",
      "cha-de-bebe-e-cha-revelacao-lembrancinhas",
    ],
    contentHtml: `
      <p>A chegada do bebê é o momento mais esperado — e oferecer uma <strong>lembrancinha de maternidade</strong> para as visitas é uma forma carinhosa de agradecer quem foi conhecer o pequeno. Reunimos aqui 12 ideias práticas, bonitas e que cabem no bolso.</p>

      <h2>Por que dar lembrancinha na maternidade?</h2>
      <p>Diferente do chá de bebê (planejado com semanas de antecedência), a maternidade exige praticidade: a lembrancinha precisa estar <strong>pronta antes do parto</strong>, ser leve, perfumada de forma suave e fácil de distribuir no quarto.</p>

      <h2>12 ideias de lembrancinhas para encantar as visitas</h2>
      <ol>
        <li><strong>Mini sabonete em formato de ursinho</strong> — clássico, perfumado e econômico.</li>
        <li><strong>Sabonete coração</strong> com tag "Obrigada por nos visitar".</li>
        <li><strong>Vela aromática</strong> em potinho de vidro com nome do bebê.</li>
        <li><strong>Sachê perfumado</strong> para guarda-roupa.</li>
        <li><strong>Mini hidratante</strong> em embalagem personalizada.</li>
        <li><strong>Difusor de ambiente</strong> em mini frasco.</li>
        <li><strong>Kit lavabo</strong> com sabonete líquido + sólido.</li>
        <li><strong>Sabonete em formato de pezinho</strong> de bebê.</li>
        <li><strong>Mini saboneteira</strong> com sabonete dentro.</li>
        <li><strong>Tubete com balas</strong> e tag personalizada.</li>
        <li><strong>Mini álcool em gel</strong> perfumado.</li>
        <li><strong>Caixinha mista</strong> com sabonete + bombom.</li>
      </ol>

      <h2>Quanto custa em média?</h2>
      <p>O preço por unidade varia de <strong>R$ 4 a R$ 12</strong>, dependendo do tamanho, embalagem e personalização. Para 30 a 50 visitas, o investimento médio fica entre R$ 150 e R$ 400 — bem mais acessível que outras lembranças decorativas.</p>

      <h2>Onde encomendar lembrancinhas de maternidade prontas</h2>
      <p>No Empório LeleCute oferecemos kits completos prontos para a maternidade, com personalização do nome do bebê, tag artesanal e embalagem em organza. Veja todos os modelos disponíveis na nossa <a href="/lembrancinhas-maternidade">página de Lembrancinhas de Maternidade</a> ou explore o <a href="/produtos">catálogo completo</a>.</p>

      <p>Quer fazer você mesma? Confira nosso <a href="/blog/como-fazer-sabonete-artesanal-para-lembrancinhas">guia passo a passo de sabonete artesanal</a>.</p>
    `,
  },

  // ────────────────────────────────────────────────────────────────
  // POST 3 — CHÁ DE BEBÊ + CHÁ REVELAÇÃO
  // ────────────────────────────────────────────────────────────────
  {
    slug: "cha-de-bebe-e-cha-revelacao-lembrancinhas",
    title: "Chá de Bebê e Chá Revelação: ideias de lembrancinhas que encantam",
    excerpt:
      "Inspirações de lembrancinhas para chá de bebê e chá revelação: temas, paletas, sabonetes personalizados e dicas para acertar na escolha.",
    seoTitle: "Lembrancinhas para Chá de Bebê e Chá Revelação | Ideias e Dicas",
    seoDescription:
      "Guia com ideias de lembrancinhas para chá de bebê e chá revelação: temas, paletas, sabonetes personalizados e dicas para escolher.",
    publishedAt: "2026-05-13",
    readingMinutes: 7,
    category: "Inspiração",
    tags: ["chá de bebê", "chá revelação", "lembrancinhas"],
    author: AUTHOR,
    published: true,
    relatedSlugs: [
      "lembrancinhas-maternidade-ideias-criativas",
      "como-fazer-sabonete-artesanal-para-lembrancinhas",
    ],
    contentHtml: `
      <p>O <strong>chá de bebê</strong> e o <strong>chá revelação</strong> são dois dos momentos mais aguardados pela família, e a lembrancinha tem papel especial: representa o carinho da anfitriã com cada convidado. Veja como acertar.</p>

      <h2>Chá de bebê: o que considerar</h2>
      <ul>
        <li><strong>Tema da festa</strong> — combine a lembrancinha com a paleta (safari, nuvens, ursinhos, balão).</li>
        <li><strong>Quantidade</strong> — encomende 10–20% a mais para imprevistos.</li>
        <li><strong>Personalização</strong> — tags com nome do bebê e data.</li>
        <li><strong>Praticidade</strong> — itens fáceis de transportar e que não derretam.</li>
      </ul>

      <h2>Top lembrancinhas para chá de bebê</h2>
      <ol>
        <li>Sabonete em formato de ursinho, mamadeira ou pezinho.</li>
        <li>Velinhas em potinhos com tag personalizada.</li>
        <li>Mini hidratante com rótulo customizado.</li>
        <li>Caixinha kraft com sabonete + bala.</li>
        <li>Saquinho de organza com 2 sabonetes mini.</li>
      </ol>
      <p>Veja nossa página dedicada de <a href="/lembrancinhas-cha-de-bebe">Lembrancinhas para Chá de Bebê</a> com todos os modelos disponíveis.</p>

      <h2>Chá revelação: o segredo da paleta dupla</h2>
      <p>No chá revelação, a graça está em <strong>manter o suspense</strong>. A lembrancinha pode entrar em duas estratégias:</p>
      <ul>
        <li><strong>Neutra antes da revelação</strong> — sabonetes brancos ou amarelos com tag "menino ou menina?".</li>
        <li><strong>Personalizada após</strong> — entregue ao final, com a cor já confirmada.</li>
      </ul>

      <h3>Combinações que funcionam</h3>
      <ul>
        <li>Mini sabonete rosa + azul no mesmo saquinho.</li>
        <li>Vela bicolor (metade de cada cor).</li>
        <li>Caixinha "team boy / team girl" para os palpites.</li>
      </ul>
      <p>Confira inspirações específicas na nossa página de <a href="/lembrancinhas-cha-revelacao">Lembrancinhas para Chá Revelação</a>.</p>

      <h2>Personalização: o detalhe que faz a diferença</h2>
      <p>Tags com nome, data e mensagem curta ("Obrigada por compartilhar este momento") elevam qualquer lembrancinha. No Empório LeleCute, todas as lembrancinhas saem com tag artesanal incluída — basta informar os dados na encomenda.</p>

      <p>Quer fazer em casa? Veja o <a href="/blog/como-fazer-sabonete-artesanal-para-lembrancinhas">tutorial completo de sabonete artesanal</a>. Para encomendar prontas, fale com a artesã pelo WhatsApp ou explore o <a href="/produtos">catálogo completo</a>.</p>
    `,
  },

  // ────────────────────────────────────────────────────────────────
  // POST 4 — BATIZADO + ANIVERSÁRIO + FORMATURA
  // ────────────────────────────────────────────────────────────────
  {
    slug: "lembrancinhas-batizado-aniversario-formatura",
    title: "Lembrancinhas para Batizado, Aniversário e Formatura: guia rápido",
    excerpt:
      "Ideias de lembrancinhas artesanais para batizado, aniversário infantil e formatura: símbolos, cores, paletas e dicas de personalização.",
    seoTitle: "Lembrancinhas para Batizado, Aniversário e Formatura | Empório LeleCute",
    seoDescription:
      "Guia rápido com ideias de lembrancinhas para batizado, aniversário infantil e formatura: símbolos, paletas e personalização.",
    publishedAt: "2026-05-13",
    readingMinutes: 6,
    category: "Inspiração",
    tags: ["batizado", "aniversário", "formatura", "lembrancinhas"],
    author: AUTHOR,
    published: true,
    relatedSlugs: [
      "como-fazer-sabonete-artesanal-para-lembrancinhas",
      "lembrancinhas-maternidade-ideias-criativas",
    ],
    contentHtml: `
      <p>Cada celebração pede uma lembrancinha com a sua identidade. Reunimos aqui as ideias que mais funcionam para três momentos muito especiais: <strong>batizado</strong>, <strong>aniversário infantil</strong> e <strong>formatura</strong>.</p>

      <h2>Batizado: delicadeza e significado</h2>
      <p>A lembrancinha de batizado costuma ter <strong>tom religioso suave</strong>, sem exageros. Os formatos mais pedidos são:</p>
      <ul>
        <li>Sabonete em formato de <strong>cruz</strong>, <strong>anjo</strong> ou <strong>terço</strong>.</li>
        <li>Mini terço com tag personalizada.</li>
        <li>Saquinhos brancos com sabonete + tag religiosa.</li>
      </ul>
      <p>Cores ideais: branco, off-white, dourado e tons pastel. Veja modelos prontos na <a href="/lembrancinhas-batizado">página de Lembrancinhas para Batizado</a>.</p>

      <h2>Aniversário infantil: tema é tudo</h2>
      <p>Em festa de criança, a lembrancinha precisa <strong>conversar com o tema</strong>. Algumas combinações que sempre dão certo:</p>
      <ul>
        <li><strong>Safari / Jardim</strong> — sabonetes em formato de animais.</li>
        <li><strong>Princesas</strong> — formatos de coroa, coração e estrela em tons pastel.</li>
        <li><strong>Carrinhos / Dinos</strong> — formatos temáticos em cores vivas.</li>
        <li><strong>Unicórnio</strong> — paleta rosa, lilás e dourado com glitter.</li>
      </ul>
      <p>Confira ideias completas em <a href="/lembrancinhas-aniversario-infantil">Lembrancinhas para Aniversário Infantil</a>.</p>

      <h2>Formatura: elegância e memória afetiva</h2>
      <p>A lembrancinha de formatura marca o fim de um ciclo. Aposte em peças <strong>úteis e elegantes</strong>, na cor da turma:</p>
      <ul>
        <li>Sabonetes em formato de <strong>capelo</strong> ou <strong>diploma</strong>.</li>
        <li>Mini velas perfumadas com tag "Formada(o) [ano]".</li>
        <li>Caixinhas com sabonete + bombom artesanal.</li>
      </ul>
      <p>Veja todas as opções em <a href="/lembrancinhas-formatura">Lembrancinhas para Formatura</a>.</p>

      <h2>Dica final: comece cedo</h2>
      <p>Para encomendas acima de 50 unidades, recomendamos iniciar o pedido com pelo menos <strong>3 semanas de antecedência</strong> — assim sobra tempo para escolher essência, ajustar tags e revisar a embalagem.</p>

      <p>Pronto para encomendar? Fale com a artesã pelo WhatsApp ou explore nosso <a href="/produtos">catálogo completo de sabonetes personalizados</a>. Quer fazer você mesma? Veja o <a href="/blog/como-fazer-sabonete-artesanal-para-lembrancinhas">guia passo a passo</a>.</p>
    `,
  },
];

export const getPublishedPosts = () =>
  BLOG_POSTS.filter((p) => p.published).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

export const getPostBySlug = (slug: string) =>
  BLOG_POSTS.find((p) => p.slug === slug && p.published);

export const getRelatedPosts = (slug: string, limit = 3) => {
  const current = BLOG_POSTS.find((p) => p.slug === slug);
  if (!current) return [];
  const explicit = (current.relatedSlugs || [])
    .map((s) => BLOG_POSTS.find((p) => p.slug === s && p.published))
    .filter((p): p is BlogPost => Boolean(p));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const fillers = getPublishedPosts().filter(
    (p) => p.slug !== slug && !explicit.find((e) => e.slug === p.slug),
  );
  return [...explicit, ...fillers].slice(0, limit);
};
