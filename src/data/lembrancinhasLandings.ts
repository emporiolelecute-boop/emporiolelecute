/**
 * Configuração das 6 landing pages SEO do Horizonte 2.
 * Cada entry vira uma rota /lembrancinhas-<slug> renderizada por <LembrancinhasLanding>.
 *
 * Para editar copy/FAQs/relacionadas no futuro: alterar este arquivo.
 * Para promover ao admin com CMS: migrar para tabela `occasion_landings` + hook.
 */

export interface LandingFAQ {
  question: string;
  answer: string;
}

export interface LembrancinhasLandingConfig {
  /** Slug da URL — `/lembrancinhas-<routeSlug>` */
  routeSlug: string;
  /** Slug da ocasião no banco (occasions.slug) usado para filtrar produtos */
  occasionSlug: string;
  /** <title> e og:title (até 60 chars) */
  seoTitle: string;
  /** <meta description> (até 160 chars) */
  seoDescription: string;
  /** H1 visível */
  h1: string;
  /** Frase de apoio sob o H1 */
  heroSubtitle: string;
  /** Selo / badge no topo do hero */
  heroBadge: string;
  /** Cor de destaque (Tailwind class para gradient suave) */
  themeAccent: string;
  /** Texto longo de SEO (~150-200 palavras) renderizado abaixo do grid */
  seoCopy: string;
  /** Mensagem pré-preenchida do WhatsApp */
  whatsappMessage: string;
  /** FAQs específicas da ocasião */
  faqs: LandingFAQ[];
  /** Slugs de outras landings para "Você também pode gostar" */
  relatedRouteSlugs: string[];
}

export const LEMBRANCINHAS_LANDINGS: LembrancinhasLandingConfig[] = [
  {
    routeSlug: "cha-de-bebe",
    occasionSlug: "cha-bebe",
    seoTitle: "Lembrancinhas para Chá de Bebê Personalizadas | Empório LeleCute",
    seoDescription:
      "Lembrancinhas artesanais para chá de bebê: sabonetes, velas e kits personalizados com o nome do bebê. Entrega em todo Brasil. Faça seu orçamento via WhatsApp.",
    h1: "Lembrancinhas para Chá de Bebê Personalizadas",
    heroSubtitle:
      "Sabonetes e velas artesanais com o nome do seu bebê. Encantam os convidados, perfumam a memória do dia mais doce.",
    heroBadge: "Chá de Bebê",
    themeAccent: "from-blue-100 to-pink-100",
    seoCopy:
      "Encontre as lembrancinhas para chá de bebê perfeitas para celebrar a chegada do pequeno em casa. No Empório LeleCute, cada peça é produzida artesanalmente com matéria-prima hipoalergênica e personalizada com o nome do bebê, data e cores tema (rosa, azul ou neutro). Trabalhamos com sabonetes em formatos delicados, mini velas perfumadas e kits prontos para presentear, embalados individualmente. Pedido mínimo a partir de 20 unidades, com prazo de produção de 7 dias úteis e entrega para todo o Brasil. Faça seu orçamento direto pelo WhatsApp e receba a arte da personalização para aprovação antes da produção.",
    whatsappMessage:
      "Olá! Vim pela página de lembrancinhas para chá de bebê. Gostaria de um orçamento personalizado.",
    faqs: [
      {
        question: "Qual a quantidade mínima de lembrancinhas para chá de bebê?",
        answer:
          "O pedido mínimo varia por produto, geralmente a partir de 20 unidades. Cada produto exibe a quantidade mínima específica na página de orçamento.",
      },
      {
        question: "Posso personalizar com o nome do bebê?",
        answer:
          "Sim! Todas as nossas lembrancinhas para chá de bebê podem ser personalizadas com nome, data de nascimento e cores tema. Enviamos a arte para aprovação antes da produção.",
      },
      {
        question: "Qual o prazo de produção e entrega?",
        answer:
          "O prazo padrão de produção é de 7 dias úteis após a confirmação do pedido. A entrega depende da sua cidade — calculamos pelo Correios ou transportadora informando o CEP.",
      },
      {
        question: "Vocês têm opções para tema rosa, azul ou neutro?",
        answer:
          "Sim! Personalizamos as cores das embalagens, fitas e tags conforme o tema do seu chá: rosa para menina, azul para menino, ou cores neutras como bege, branco e dourado.",
      },
      {
        question: "Enviam para todo o Brasil?",
        answer:
          "Sim, enviamos para todo o Brasil via Correios ou transportadora. O frete é calculado com base no CEP de entrega no momento do orçamento.",
      },
      {
        question: "Como faço o pedido?",
        answer:
          "Escolha o produto, defina a quantidade e clique em orçar pelo WhatsApp. Nossa atendente confirma os detalhes da personalização, calcula o frete e envia o link de pagamento.",
      },
    ],
    relatedRouteSlugs: ["maternidade", "cha-revelacao"],
  },
  {
    routeSlug: "maternidade",
    occasionSlug: "maternidade",
    seoTitle: "Lembrancinhas de Maternidade Artesanais | Empório LeleCute",
    seoDescription:
      "Lembrancinhas de maternidade exclusivas: kits com sabonete, vela aromática e tag com nome do bebê. Entrega rápida em todo Brasil. Orce pelo WhatsApp.",
    h1: "Lembrancinhas de Maternidade para Visitas",
    heroSubtitle:
      "Presenteie quem foi conhecer o bebê com kits artesanais perfumados, embalados com carinho e personalizados.",
    heroBadge: "Maternidade",
    themeAccent: "from-pink-100 to-rose-100",
    seoCopy:
      "As lembrancinhas de maternidade do Empório LeleCute são pensadas para receber as visitas que vão conhecer o bebê na maternidade ou em casa. Combinamos sabonetes artesanais e mini velas perfumadas em kits prontos, com embalagem delicada e tag personalizada com nome e data de nascimento do recém-nascido. Trabalhamos com produção rápida (7 dias úteis) para encaixar no prazo do nascimento, e quantidade mínima a partir de 20 kits. Atendemos famílias em todo o Brasil com envio via Correios ou transportadora. O orçamento é feito direto pelo WhatsApp em poucos minutos, com envio prévio da arte para aprovação.",
    whatsappMessage:
      "Olá! Vim pela página de lembrancinhas de maternidade. Gostaria de um orçamento personalizado.",
    faqs: [
      {
        question: "Quanto tempo antes do nascimento devo encomendar?",
        answer:
          "Recomendamos encomendar com pelo menos 15 dias de antecedência da data prevista de parto, considerando 7 dias de produção + frete.",
      },
      {
        question: "Posso encomendar depois que o bebê nascer?",
        answer:
          "Sim! Trabalhamos com produção em 7 dias úteis. Assim que o bebê nascer e você confirmar nome e data, iniciamos a personalização.",
      },
      {
        question: "Qual a quantidade mínima de kits?",
        answer:
          "O mínimo varia por produto, geralmente a partir de 20 unidades. Cada produto exibe a quantidade mínima na página de orçamento.",
      },
      {
        question: "Posso escolher os perfumes das velas?",
        answer:
          "Sim, oferecemos opções suaves como baunilha, lavanda, alecrim e flores. Indicamos sempre fragrâncias hipoalergênicas, seguras para o ambiente do bebê.",
      },
      {
        question: "Como personalizo a tag?",
        answer:
          "Você nos envia o nome do bebê, data de nascimento e (opcional) uma frase curta. Enviamos a arte da tag para aprovação antes da produção.",
      },
      {
        question: "Vocês entregam em todo Brasil?",
        answer:
          "Sim! Enviamos para todo Brasil via Correios ou transportadora. O frete é calculado pelo CEP no momento do orçamento.",
      },
    ],
    relatedRouteSlugs: ["cha-de-bebe", "cha-revelacao"],
  },
  {
    routeSlug: "cha-revelacao",
    occasionSlug: "cha-revelacao",
    seoTitle: "Lembrancinhas para Chá Revelação Rosa ou Azul | Empório LeleCute",
    seoDescription:
      "Lembrancinhas para chá revelação: sabonetes e velas em rosa, azul ou neutro, com tag personalizada. Surpreenda os convidados. Orçamento pelo WhatsApp.",
    h1: "Lembrancinhas para Chá Revelação",
    heroSubtitle:
      "Surpreenda os convidados na hora da revelação com lembrancinhas artesanais em rosa, azul ou tema neutro.",
    heroBadge: "Chá Revelação",
    themeAccent: "from-pink-100 to-blue-100",
    seoCopy:
      "Faça seu chá revelação ainda mais memorável com lembrancinhas artesanais que combinam com o tema da surpresa. No Empório LeleCute produzimos sabonetes e mini velas em embalagens rosa (menina), azul (menino) ou neutras (caso queira manter o suspense), com tag personalizada com o nome dos pais e data do chá. Cada peça é feita à mão, com matéria-prima hipoalergênica, embalada individualmente para presentear. Pedido mínimo a partir de 20 unidades, prazo de 7 dias úteis e entrega para todo o Brasil. Solicite seu orçamento agora pelo WhatsApp.",
    whatsappMessage:
      "Olá! Vim pela página de lembrancinhas para chá revelação. Gostaria de um orçamento personalizado.",
    faqs: [
      {
        question: "Posso pedir kits mistos rosa e azul?",
        answer:
          "Sim! Você pode dividir o pedido entre kits rosa e azul, ou pedir tudo em cor neutra para manter a surpresa até a hora da revelação.",
      },
      {
        question: "A embalagem revela o sexo do bebê?",
        answer:
          "Você decide! Trabalhamos tanto com embalagens coloridas (rosa/azul) quanto neutras. Muitas mamães preferem entregar em embalagem neutra e revelar na hora.",
      },
      {
        question: "Qual a quantidade mínima?",
        answer:
          "O mínimo varia por produto, geralmente a partir de 20 unidades. Cada produto exibe a quantidade mínima na página de orçamento.",
      },
      {
        question: "Quanto tempo antes do chá devo encomendar?",
        answer:
          "Recomendamos pelo menos 15 dias de antecedência: 7 dias de produção + frete (varia conforme cidade).",
      },
      {
        question: "Vocês fazem tag personalizada com nome dos pais?",
        answer:
          "Sim, personalizamos a tag com nome dos pais, data do chá e mensagem opcional. Enviamos a arte para aprovação antes da produção.",
      },
      {
        question: "Enviam para todo Brasil?",
        answer:
          "Sim, enviamos para todo Brasil via Correios ou transportadora. O frete é calculado pelo CEP no orçamento.",
      },
    ],
    relatedRouteSlugs: ["cha-de-bebe", "maternidade"],
  },
  {
    routeSlug: "batizado",
    occasionSlug: "batizado",
    seoTitle: "Lembrancinhas de Batizado Artesanais e Religiosas | Empório LeleCute",
    seoDescription:
      "Lembrancinhas de batizado com terço, oração ou anjinho personalizadas. Sabonetes e velas artesanais. Entrega em todo Brasil. Orçamento via WhatsApp.",
    h1: "Lembrancinhas de Batizado Personalizadas",
    heroSubtitle:
      "Sabonetes, velas e mini terços artesanais para celebrar este sacramento com delicadeza e fé.",
    heroBadge: "Batizado",
    themeAccent: "from-purple-100 to-blue-100",
    seoCopy:
      "Celebre o batizado do seu filho ou afilhado com lembrancinhas artesanais que carregam delicadeza e simbolismo religioso. No Empório LeleCute oferecemos sabonetes em formato de anjinho, mini velas com terço e kits prontos personalizados com o nome da criança e data da cerimônia. Cada peça é embalada individualmente com tag e fita, pronta para entregar aos padrinhos, madrinhas e convidados. Trabalhamos com mínimo a partir de 20 unidades, prazo de 7 dias úteis e enviamos para todo o Brasil. Solicite seu orçamento pelo WhatsApp e receba a arte da personalização.",
    whatsappMessage:
      "Olá! Vim pela página de lembrancinhas de batizado. Gostaria de um orçamento personalizado.",
    faqs: [
      {
        question: "Vocês têm lembrancinhas com terço?",
        answer:
          "Sim, trabalhamos com mini terços artesanais que podem ser combinados com sabonetes ou velas em kits, embalados em saquinhos delicados.",
      },
      {
        question: "Posso personalizar com o nome da criança?",
        answer:
          "Sim! Personalizamos a tag com o nome da criança, data do batizado e nome dos padrinhos (opcional).",
      },
      {
        question: "Qual a quantidade mínima?",
        answer:
          "O mínimo varia por produto, geralmente a partir de 20 unidades. Cada produto exibe a quantidade mínima na página de orçamento.",
      },
      {
        question: "Tem opção em formato de anjinho?",
        answer:
          "Sim! Temos sabonetes em formato de anjinho, perfeitos para batizado. Disponíveis em cores neutras (branco, dourado, prata).",
      },
      {
        question: "Quanto tempo antes da cerimônia devo encomendar?",
        answer:
          "Recomendamos pelo menos 15 dias antes do batizado: 7 dias de produção + frete (varia conforme a cidade).",
      },
      {
        question: "Enviam para todo o Brasil?",
        answer:
          "Sim, atendemos todo o Brasil via Correios ou transportadora. O frete é calculado pelo CEP.",
      },
    ],
    relatedRouteSlugs: ["aniversario-infantil", "maternidade"],
  },
  {
    routeSlug: "aniversario-infantil",
    occasionSlug: "aniversario",
    seoTitle: "Lembrancinhas de Aniversário Infantil Personalizadas | Empório LeleCute",
    seoDescription:
      "Lembrancinhas de aniversário infantil temáticas: princesas, super-heróis, safári e mais. Sabonetes e velas com nome da criança. Entrega Brasil.",
    h1: "Lembrancinhas de Aniversário Infantil",
    heroSubtitle:
      "Sabonetes e mini velas temáticos personalizados com o nome da criança. Encantam todos os convidados.",
    heroBadge: "Aniversário Infantil",
    themeAccent: "from-amber-100 to-pink-100",
    seoCopy:
      "Faça a festa do seu filho inesquecível com lembrancinhas de aniversário infantil artesanais e temáticas. No Empório LeleCute personalizamos sabonetes e mini velas em diversos temas: princesas, jardim encantado, safári, dinossauros, super-heróis, bailarina e muito mais. Cada peça leva o nome da criança e a idade no rótulo, embalada individualmente para entregar na festa. Pedido mínimo a partir de 20 unidades, prazo de produção de 7 dias úteis e envio para todo o Brasil. Solicite seu orçamento agora pelo WhatsApp e veja a arte personalizada antes da produção.",
    whatsappMessage:
      "Olá! Vim pela página de lembrancinhas de aniversário infantil. Gostaria de um orçamento personalizado.",
    faqs: [
      {
        question: "Quais temas vocês trabalham?",
        answer:
          "Trabalhamos com princesas, jardim encantado, safári, dinossauros, super-heróis, bailarina, fundo do mar, fazendinha e muitos outros. Se tiver um tema específico em mente, é só pedir!",
      },
      {
        question: "Posso personalizar com nome e idade da criança?",
        answer:
          "Sim! Personalizamos a tag com o nome da criança, idade comemorada e tema da festa. Enviamos a arte para aprovação antes da produção.",
      },
      {
        question: "Qual a quantidade mínima?",
        answer:
          "O mínimo varia por produto, geralmente a partir de 20 unidades. Cada produto exibe a quantidade mínima na página de orçamento.",
      },
      {
        question: "Vocês fazem combos sabonete + vela?",
        answer:
          "Sim! Montamos kits que combinam sabonete artesanal e mini vela temática, embalados juntos em caixinha ou saquinho transparente.",
      },
      {
        question: "Quanto tempo antes da festa devo encomendar?",
        answer:
          "Recomendamos pelo menos 15 dias antes da festa: 7 dias de produção + frete.",
      },
      {
        question: "Enviam para todo Brasil?",
        answer:
          "Sim, enviamos para todo Brasil via Correios ou transportadora. Frete calculado pelo CEP.",
      },
    ],
    relatedRouteSlugs: ["batizado", "formatura"],
  },
  {
    routeSlug: "formatura",
    occasionSlug: "formatura",
    seoTitle: "Lembrancinhas de Formatura Personalizadas | Empório LeleCute",
    seoDescription:
      "Lembrancinhas de formatura ABC, infantil e universitária com nome e ano. Sabonetes e velas artesanais. Quantidade a partir de 30. Orçamento WhatsApp.",
    h1: "Lembrancinhas de Formatura Personalizadas",
    heroSubtitle:
      "Marque essa conquista com lembrancinhas artesanais personalizadas com nome do formando e ano de formatura.",
    heroBadge: "Formatura",
    themeAccent: "from-emerald-100 to-amber-100",
    seoCopy:
      "Eternize o momento da formatura com lembrancinhas artesanais personalizadas. No Empório LeleCute atendemos formaturas ABC, infantil, ensino médio, técnica e universitária — com sabonetes e mini velas temáticos com o nome do formando, ano e curso (opcional). Cada peça é embalada individualmente, pronta para entregar aos convidados na cerimônia ou festa. Pedido mínimo a partir de 30 unidades, prazo de 7 dias úteis e envio para todo o Brasil. Solicite seu orçamento agora pelo WhatsApp.",
    whatsappMessage:
      "Olá! Vim pela página de lembrancinhas de formatura. Gostaria de um orçamento personalizado.",
    faqs: [
      {
        question: "Vocês fazem para formatura ABC e infantil?",
        answer:
          "Sim! Atendemos todos os tipos de formatura: ABC, infantil, ensino médio, técnica e universitária. Personalizamos conforme o nível.",
      },
      {
        question: "Posso colocar o nome do curso?",
        answer:
          "Sim, personalizamos a tag com nome do formando, ano e curso (opcional). Enviamos a arte para aprovação.",
      },
      {
        question: "Qual a quantidade mínima?",
        answer:
          "Para formatura, o mínimo costuma ser a partir de 30 unidades. Cada produto exibe a quantidade mínima específica.",
      },
      {
        question: "Posso pedir nas cores da minha turma?",
        answer:
          "Sim! Personalizamos cores das embalagens, fitas e tags conforme as cores da sua turma ou curso.",
      },
      {
        question: "Quanto tempo antes da formatura devo encomendar?",
        answer:
          "Recomendamos pelo menos 15 dias antes da cerimônia: 7 dias de produção + frete.",
      },
      {
        question: "Enviam para todo Brasil?",
        answer:
          "Sim, enviamos para todo Brasil via Correios ou transportadora.",
      },
    ],
    relatedRouteSlugs: ["aniversario-infantil", "batizado"],
  },
];

export const getLandingByRouteSlug = (
  routeSlug: string
): LembrancinhasLandingConfig | undefined =>
  LEMBRANCINHAS_LANDINGS.find((l) => l.routeSlug === routeSlug);
