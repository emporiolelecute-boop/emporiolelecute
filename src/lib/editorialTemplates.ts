// Fase 8 — Templates editoriais (snippets/placeholders) para apoiar a operação humana.
// NÃO geram conteúdo automaticamente: servem como ponto de partida para edição manual.

export interface EditorialTemplate {
  key: string;
  label: string;
  /** Pequena descrição do propósito do template (mostrada no picker). */
  hint?: string;
  /** Texto base com placeholders no formato {{placeholder}}. */
  body: string;
}

export interface EditorialTemplateGroup {
  /** Tipo: 'category' | 'occasion'. */
  scope: 'category' | 'occasion';
  /** Slug da taxonomia para casar com produto. */
  slug: string;
  /** Nome amigável. */
  label: string;
  templates: EditorialTemplate[];
}

const block = (...parts: string[]) => parts.join('\n\n').trim();

// ---------- CATEGORIAS ----------
const CATEGORY_TEMPLATES: EditorialTemplateGroup[] = [
  {
    scope: 'category',
    slug: 'sabonetes',
    label: 'Sabonetes artesanais',
    templates: [
      {
        key: 'sabonetes-intro',
        label: 'Introdução sensorial',
        hint: 'Texto inicial sensorial + apresentação.',
        body: block(
          `Cada {{produto}} é feito à mão na cozinha do Empório LeleCute, com {{ingrediente_principal}} e essências cuidadosamente escolhidas.`,
          `Textura cremosa, perfume suave e aparência delicada — pensado para encantar logo no primeiro contato.`,
        ),
      },
      {
        key: 'sabonetes-uso',
        label: 'Sugestões de uso',
        body: block(
          `Use como mimo no banho do dia a dia, em rituais de cuidado pessoal ou como decoração no lavabo.`,
          `Ideal também para presentear convidados em {{ocasiao}} e marcar o momento com um detalhe artesanal.`,
        ),
      },
      {
        key: 'sabonetes-fechamento',
        label: 'Fechamento emocional',
        body: `Mais do que um sabonete: é um pequeno gesto que transforma um momento comum em memória afetiva.`,
      },
    ],
  },
  {
    scope: 'category',
    slug: 'velas',
    label: 'Velas aromáticas',
    templates: [
      {
        key: 'velas-intro',
        label: 'Introdução aromática',
        body: block(
          `Esta {{produto}} foi pensada para criar atmosfera: chama suave, aroma envolvente e queima limpa.`,
          `Cada peça é despejada manualmente, garantindo acabamento único — pequenas diferenças fazem parte do charme artesanal.`,
        ),
      },
      {
        key: 'velas-decoracao',
        label: 'Decoração & ambientação',
        body: `Combina com mesas postas, lavabos, cantinhos de leitura e ambientes que pedem uma pausa.`,
      },
      {
        key: 'velas-presente',
        label: 'Como presente',
        body: `Embalada com carinho, é uma lembrança elegante para {{ocasiao}} e para quem aprecia o ritual de acender uma vela.`,
      },
    ],
  },
  {
    scope: 'category',
    slug: 'sachês',
    label: 'Sachês perfumados',
    templates: [
      {
        key: 'saches-intro',
        label: 'Introdução',
        body: `O {{produto}} perfuma gavetas, armários e pequenos cantos com fragrância delicada e duradoura.`,
      },
      {
        key: 'saches-presente',
        label: 'Como lembrancinha',
        body: `Charmoso e leve, é uma das lembrancinhas mais queridas para {{ocasiao}} — ocupa pouco espaço e deixa um perfume marcante.`,
      },
    ],
  },
  {
    scope: 'category',
    slug: 'escalda-pes',
    label: 'Kits escalda-pés',
    templates: [
      {
        key: 'escalda-intro',
        label: 'Introdução de bem-estar',
        body: block(
          `Um momento de pausa para os pés cansados: o {{produto}} reúne sais aromáticos e ervas para um banho relaxante.`,
          `Pensado para quem deseja transformar o fim do dia em um pequeno ritual de autocuidado.`,
        ),
      },
      {
        key: 'escalda-uso',
        label: 'Como usar',
        body: `Adicione o conteúdo em água morna, mergulhe os pés por 10–15 minutos e respire fundo.`,
      },
    ],
  },
];

// ---------- OCASIÕES ----------
const OCCASION_TEMPLATES: EditorialTemplateGroup[] = [
  {
    scope: 'occasion',
    slug: 'maternidade',
    label: 'Maternidade',
    templates: [
      {
        key: 'maternidade-contexto',
        label: 'Contexto emocional',
        body: `Para celebrar a chegada de um novo amor: o {{produto}} acompanha esse momento único com delicadeza.`,
      },
      {
        key: 'maternidade-personalizacao',
        label: 'Personalização',
        body: `Pode ser personalizado com o nome do bebê, data de nascimento ou uma mensagem da família.`,
      },
    ],
  },
  {
    scope: 'occasion',
    slug: 'cha-de-bebe',
    label: 'Chá de bebê',
    templates: [
      {
        key: 'cha-bebe-intro',
        label: 'Introdução',
        body: `Para o seu chá de bebê, o {{produto}} entrega charme, tema e funcionalidade em uma lembrancinha que os convidados realmente guardam.`,
      },
      {
        key: 'cha-bebe-apresentacao',
        label: 'Apresentação',
        body: `Embalado com fita e tag personalizada, combina com mesas decoradas e fotos.`,
      },
    ],
  },
  {
    scope: 'occasion',
    slug: 'casamento',
    label: 'Casamento',
    templates: [
      {
        key: 'casamento-intro',
        label: 'Introdução elegante',
        body: `O {{produto}} foi pensado para casamentos que valorizam o detalhe — uma lembrança feita à mão que conversa com a paleta dos noivos.`,
      },
      {
        key: 'casamento-personalizacao',
        label: 'Personalização',
        body: `Personalizamos com nomes, iniciais ou data — combinando com o tema da celebração.`,
      },
    ],
  },
  {
    scope: 'occasion',
    slug: 'batizado',
    label: 'Batizado',
    templates: [
      {
        key: 'batizado-intro',
        label: 'Introdução afetiva',
        body: `Para marcar o batizado, o {{produto}} oferece símbolo, delicadeza e perfume — uma lembrança que cabe na palma da mão e fica na memória.`,
      },
    ],
  },
  {
    scope: 'occasion',
    slug: 'aniversario',
    label: 'Aniversário',
    templates: [
      {
        key: 'aniversario-intro',
        label: 'Introdução',
        body: `Lembrancinhas que continuam a festa em casa: o {{produto}} é pensado para encantar convidados de todas as idades.`,
      },
    ],
  },
  {
    scope: 'occasion',
    slug: 'formatura',
    label: 'Formatura',
    templates: [
      {
        key: 'formatura-intro',
        label: 'Introdução',
        body: `Para celebrar uma conquista: o {{produto}} se torna uma lembrança elegante para quem participou da sua trajetória.`,
      },
    ],
  },
];

export const EDITORIAL_TEMPLATES: EditorialTemplateGroup[] = [
  ...CATEGORY_TEMPLATES,
  ...OCCASION_TEMPLATES,
];

/** Busca templates compatíveis a partir dos slugs de categoria/ocasião do produto. */
export function findEditorialTemplates(opts: {
  categorySlug?: string | null;
  occasionSlugs?: string[];
}): EditorialTemplateGroup[] {
  const out: EditorialTemplateGroup[] = [];
  if (opts.categorySlug) {
    const g = CATEGORY_TEMPLATES.find((g) => g.slug === opts.categorySlug);
    if (g) out.push(g);
  }
  for (const s of opts.occasionSlugs ?? []) {
    const g = OCCASION_TEMPLATES.find((g) => g.slug === s);
    if (g) out.push(g);
  }
  return out;
}

/** Aplica placeholders simples ({{produto}}, {{ocasiao}}…) sem nada autom. obrigatório. */
export function fillTemplate(
  body: string,
  vars: Record<string, string | undefined | null>,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const v = vars[key];
    return v && v.trim() ? v.trim() : `{{${key}}}`;
  });
}
