export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  link: string;
  badge?: string;
  rating: number;
  category: "sabonetes" | "velas" | "kits" | "outros";
  occasions: ("maternidade" | "cha-bebe" | "batizado" | "casamento" | "aniversario" | "corporativo")[];
  keywords: string[];
}

export const products: Product[] = [
  {
    id: "1",
    slug: "sabonete-margarida-caixinha",
    name: "Sabonete Margarida na Caixinha",
    description: "Sabonetes artesanais em formato de margarida, decorados e embalados em caixinhas elegantes. Perfeitos como lembrancinhas personalizadas de chá de bebê, maternidade ou aniversário.",
    longDescription: "Nosso sabonete margarida é produzido artesanalmente com matéria-prima hipoalergênica de alta qualidade. Cada peça é cuidadosamente moldada em formato de margarida, criando uma lembrancinha delicada e perfumada. A embalagem em caixinha elegante pode ser personalizada com tag, laço e cores de sua preferência. Ideal para maternidade, chá de bebê, aniversário e outras ocasiões especiais.",
    price: "R$ 4,60",
    image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
    images: [
      "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
      "https://img.elo7.com.br/product/685x685/50E2394/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg"
    ],
    link: "https://www.elo7.com.br/lembrancinha-sabonete-margarida-na-caixinha/dp/1FB93C8",
    badge: "Mais Vendido",
    rating: 5,
    category: "sabonetes",
    occasions: ["maternidade", "cha-bebe", "aniversario"],
    keywords: ["margarida", "flor", "caixinha", "elegante", "feminino", "sabonete artesanal"]
  },
  {
    id: "2",
    slug: "vela-margarida-perfumada",
    name: "Vela Margarida Perfumada",
    description: "Mini vela perfumada em formato de margarida com cartão personalizado. Produzida com cera vegetal e pavio de algodão, esta vela aromática traz charme a qualquer decoração.",
    longDescription: "Vela artesanal em formato de flor margarida, feita com cera vegetal de alta qualidade e pavio de algodão. Fragrância suave e duradoura, ideal para criar ambientes acolhedores. Acompanha cartão personalizado com mensagem especial. Embalagem delicada perfeita para presentear.",
    price: "R$ 7,60",
    originalPrice: "R$ 8,50",
    image: "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg",
    images: [
      "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg",
      "https://img.elo7.com.br/product/685x685/54800EA/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg"
    ],
    link: "https://www.elo7.com.br/vela-margarida-perfumada-cartao-personalizado/dp/1FB93E2",
    badge: "Promoção",
    rating: 5,
    category: "velas",
    occasions: ["casamento", "maternidade", "aniversario"],
    keywords: ["vela", "perfumada", "margarida", "aroma", "decoração"]
  },
  {
    id: "3",
    slug: "sabonete-borboleta-letra-coracao",
    name: "Sabonete Borboleta + Letra + Coração",
    description: "Lindo conjunto de sabonetes artesanais com borboleta, letra personalizada e mini coração. Embalagem delicada ideal para chá de bebê, aniversário infantil ou maternidade.",
    longDescription: "Kit especial contendo três sabonetes artesanais: borboleta decorativa, letra inicial personalizada e mini coração. Todos feitos com base glicerinada hipoalergênica. Cores e aromas personalizáveis conforme tema do evento. Embalagem delicada com laço de cetim.",
    price: "R$ 4,60",
    image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
    images: [
      "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
      "https://img.elo7.com.br/product/685x685/548B940/lembrancinha-sabonete-borboleta-letra-coracao.jpg"
    ],
    link: "https://www.elo7.com.br/lembrancinha-sabonete-borboleta-letra-coracao/dp/1FB93BF",
    badge: "Personalizável",
    rating: 5,
    category: "sabonetes",
    occasions: ["cha-bebe", "maternidade", "aniversario"],
    keywords: ["borboleta", "letra", "coração", "personalizado", "infantil"]
  },
  {
    id: "4",
    slug: "sabonete-rosa-lembrancinha",
    name: "Sabonete Rosa Artesanal",
    description: "Sabonete artesanal em formato de rosa com tag personalizada. Embalagem elegante com laço de cetim. Perfeito para lembrancinhas de casamento ou chá de panela.",
    price: "R$ 5,90",
    image: "https://img.elo7.com.br/product/685x685/5232E3C/lembrancinha-sabonete-rosa-lembrancinha-casamento.jpg",
    images: [
      "https://img.elo7.com.br/product/685x685/5232E3C/lembrancinha-sabonete-rosa-lembrancinha-casamento.jpg",
      "https://img.elo7.com.br/product/685x685/5232E50/lembrancinha-sabonete-rosa-lembrancinha-casamento.jpg"
    ],
    link: "https://www.elo7.com.br/lembrancinha-sabonete-rosa/dp/1FB93D5",
    rating: 5,
    category: "sabonetes",
    occasions: ["casamento", "corporativo"],
    keywords: ["rosa", "flor", "elegante", "cetim", "sofisticado"]
  },
  {
    id: "5",
    slug: "sabonete-ursinho-bebe",
    name: "Sabonete Ursinho Bebê",
    description: "Adorável sabonete em formato de ursinho, perfeito para lembrancinhas de maternidade e chá de bebê. Feito com fórmula hipoalergênica e fragrâncias suaves.",
    price: "R$ 4,20",
    image: "https://img.elo7.com.br/product/685x685/506FA16/lembrancinha-sabonete-ursinho-lembrancinha-maternidade.jpg",
    images: [
      "https://img.elo7.com.br/product/685x685/506FA16/lembrancinha-sabonete-ursinho-lembrancinha-maternidade.jpg",
      "https://img.elo7.com.br/product/685x685/506FA2A/lembrancinha-sabonete-ursinho-lembrancinha-maternidade.jpg"
    ],
    link: "https://www.elo7.com.br/lembrancinha-sabonete-ursinho/dp/1FB93CA",
    badge: "Novidade",
    rating: 5,
    category: "sabonetes",
    occasions: ["maternidade", "cha-bebe"],
    keywords: ["ursinho", "bebê", "fofo", "infantil", "delicado"]
  },
  {
    id: "6",
    slug: "vela-coracao-perfumada",
    name: "Vela Perfumada Coração",
    description: "Vela decorativa em formato de coração com fragrância suave e duradoura. Ideal para lembrancinhas de casamento, dia dos namorados ou eventos românticos.",
    price: "R$ 6,90",
    image: "https://img.elo7.com.br/product/685x685/53A84F6/lembrancinha-vela-coracao-lembrancinha-casamento.jpg",
    link: "https://www.elo7.com.br/lembrancinha-vela-coracao/dp/1FB93D8",
    rating: 5,
    category: "velas",
    occasions: ["casamento", "aniversario"],
    keywords: ["coração", "romântico", "amor", "perfumada", "decorativa"]
  },
  {
    id: "7",
    slug: "kit-batizado-anjinho",
    name: "Kit Batizado Anjinho",
    description: "Lembrancinha especial de batizado com sabonete em formato de anjinho e tag personalizada. Embalagem delicada em tons de branco e azul ou rosa.",
    price: "R$ 5,50",
    image: "https://img.elo7.com.br/product/685x685/514C60C/lembrancinha-batizado-anjo-lembrancinha-batizado.jpg",
    link: "https://www.elo7.com.br/lembrancinha-batizado-anjo/dp/1FB93CC",
    badge: "Especial",
    rating: 5,
    category: "kits",
    occasions: ["batizado"],
    keywords: ["anjinho", "anjo", "batizado", "religioso", "fé", "proteção"]
  },
  {
    id: "8",
    slug: "sabonete-estrela-glitter",
    name: "Sabonete Estrela Glitter",
    description: "Sabonete artesanal em formato de estrela com acabamento glitter. Brilho especial para festas infantis, chá de revelação ou aniversários.",
    price: "R$ 4,40",
    image: "https://img.elo7.com.br/product/685x685/51C93C4/lembrancinha-sabonete-estrela-lembrancinha-aniversario.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-estrela/dp/1FB93CF",
    rating: 5,
    category: "sabonetes",
    occasions: ["aniversario", "cha-bebe"],
    keywords: ["estrela", "glitter", "brilho", "festa", "colorido"]
  },
  {
    id: "9",
    slug: "vela-flor-lotus",
    name: "Mini Vela Flor de Lótus",
    description: "Elegante mini vela em formato de flor de lótus flutuante. Ideal para decoração de eventos, centro de mesa ou lembrancinha sofisticada.",
    price: "R$ 8,90",
    image: "https://img.elo7.com.br/product/685x685/5466EC6/lembrancinha-vela-lotus-lembrancinha-casamento.jpg",
    link: "https://www.elo7.com.br/lembrancinha-vela-lotus/dp/1FB93DA",
    badge: "Premium",
    rating: 5,
    category: "velas",
    occasions: ["casamento", "corporativo"],
    keywords: ["lótus", "flutuante", "elegante", "sofisticado", "zen"]
  },
  {
    id: "10",
    slug: "kit-corporativo-personalizado",
    name: "Kit Corporativo Personalizado",
    description: "Kit especial para brindes corporativos com sabonete e vela personalizados com logo da empresa. Embalagem premium com acabamento profissional.",
    price: "R$ 12,90",
    image: "https://img.elo7.com.br/product/685x685/54D8F16/lembrancinha-corporativa-brinde-empresa.jpg",
    link: "https://www.elo7.com.br/lembrancinha-corporativa/dp/1FB93DC",
    badge: "Corporativo",
    rating: 5,
    category: "kits",
    occasions: ["corporativo"],
    keywords: ["corporativo", "empresa", "brinde", "logo", "profissional"]
  },
  {
    id: "11",
    slug: "sabonete-concha-mar",
    name: "Sabonete Concha do Mar",
    description: "Sabonete artesanal em formato de concha marinha. Perfeito para lembrancinhas de festa na praia, luau ou temas tropicais. Fragrância refrescante de brisa do mar.",
    price: "R$ 4,80",
    image: "https://img.elo7.com.br/product/685x685/52DEAFC/lembrancinha-sabonete-concha-tema-praia.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-concha/dp/1FB93D1",
    rating: 5,
    category: "sabonetes",
    occasions: ["aniversario", "casamento"],
    keywords: ["concha", "praia", "mar", "tropical", "verão"]
  },
  {
    id: "12",
    slug: "vela-lavanda-aromatica",
    name: "Vela Perfumada Lavanda",
    description: "Vela aromática com essência de lavanda real. Embalagem rústica com tag personalizada. Ideal para lembrancinhas de chá de panela ou despedida de solteira.",
    price: "R$ 7,20",
    image: "https://img.elo7.com.br/product/685x685/5501E8C/lembrancinha-vela-lavanda-aromatica.jpg",
    link: "https://www.elo7.com.br/lembrancinha-vela-lavanda/dp/1FB93DD",
    rating: 5,
    category: "velas",
    occasions: ["casamento", "aniversario"],
    keywords: ["lavanda", "aroma", "relaxante", "rústico", "natural"]
  },
  {
    id: "13",
    slug: "sabonete-flor-girassol",
    name: "Sabonete Girassol Artesanal",
    description: "Lindo sabonete em formato de girassol, símbolo de alegria e energia. Cores vibrantes e aroma suave. Perfeito para festas com tema fazendinha ou tropical.",
    price: "R$ 5,20",
    image: "https://img.elo7.com.br/product/685x685/50F1A5C/lembrancinha-sabonete-girassol-lembrancinha-aniversario.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-girassol/dp/1FB93CE",
    rating: 5,
    category: "sabonetes",
    occasions: ["aniversario", "cha-bebe"],
    keywords: ["girassol", "flor", "amarelo", "alegre", "fazendinha"]
  },
  {
    id: "14",
    slug: "sabonete-passarinho-ninho",
    name: "Sabonete Passarinho no Ninho",
    description: "Delicado sabonete em formato de passarinho com ninho. Tema encantador para maternidade e chá de bebê. Embalagem com laço e tag personalizada.",
    price: "R$ 5,80",
    image: "https://img.elo7.com.br/product/685x685/513C6F4/lembrancinha-passarinho-ninho-maternidade.jpg",
    link: "https://www.elo7.com.br/lembrancinha-passarinho-ninho/dp/1FB93CB",
    badge: "Fofo",
    rating: 5,
    category: "sabonetes",
    occasions: ["maternidade", "cha-bebe"],
    keywords: ["passarinho", "ninho", "pássaro", "delicado", "natureza"]
  },
  {
    id: "15",
    slug: "kit-sabonete-mini-flores",
    name: "Kit Mini Flores Sortidas",
    description: "Kit com mini sabonetes em formato de flores variadas. Rosa, margarida e botão de flor. Embalagem charmosa para lembrancinhas delicadas.",
    price: "R$ 6,50",
    image: "https://img.elo7.com.br/product/685x685/52A3E8C/lembrancinha-mini-flores-kit-sabonete.jpg",
    link: "https://www.elo7.com.br/lembrancinha-mini-flores/dp/1FB93D3",
    rating: 5,
    category: "kits",
    occasions: ["casamento", "aniversario", "maternidade"],
    keywords: ["flores", "mini", "kit", "variado", "delicado"]
  },
  {
    id: "16",
    slug: "sabonete-carrinho-bebe",
    name: "Sabonete Carrinho de Bebê",
    description: "Fofo sabonete em formato de carrinho de bebê. Ideal para chá de bebê e maternidade. Disponível em azul, rosa ou neutro. Hipoalergênico.",
    price: "R$ 4,90",
    image: "https://img.elo7.com.br/product/685x685/50C8D2E/lembrancinha-carrinho-bebe-cha-bebe.jpg",
    link: "https://www.elo7.com.br/lembrancinha-carrinho-bebe/dp/1FB93C9",
    rating: 5,
    category: "sabonetes",
    occasions: ["cha-bebe", "maternidade"],
    keywords: ["carrinho", "bebê", "infantil", "azul", "rosa"]
  },
  {
    id: "17",
    slug: "vela-cupcake-aniversario",
    name: "Vela Cupcake Decorativa",
    description: "Divertida vela em formato de cupcake com detalhes coloridos. Perfeita para aniversários infantis e festas temáticas. Aroma doce e suave.",
    price: "R$ 7,80",
    image: "https://img.elo7.com.br/product/685x685/54E2C1A/lembrancinha-vela-cupcake-aniversario.jpg",
    link: "https://www.elo7.com.br/lembrancinha-vela-cupcake/dp/1FB93DB",
    badge: "Divertido",
    rating: 5,
    category: "velas",
    occasions: ["aniversario"],
    keywords: ["cupcake", "doce", "colorido", "festa", "infantil"]
  },
  {
    id: "18",
    slug: "sabonete-coroa-princesa",
    name: "Sabonete Coroa de Princesa",
    description: "Elegante sabonete em formato de coroa real. Ideal para festas de princesa, 15 anos ou debutante. Acabamento dourado ou prateado. Embalagem luxuosa.",
    price: "R$ 5,40",
    image: "https://img.elo7.com.br/product/685x685/51B4D8C/lembrancinha-sabonete-coroa-princesa.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-coroa/dp/1FB93CD",
    rating: 5,
    category: "sabonetes",
    occasions: ["aniversario"],
    keywords: ["coroa", "princesa", "realeza", "15 anos", "debutante"]
  }
];

export const categories = [
  { id: "sabonetes", name: "Sabonetes", icon: "🧼" },
  { id: "velas", name: "Velas", icon: "🕯️" },
  { id: "kits", name: "Kits", icon: "🎁" },
  { id: "outros", name: "Outros", icon: "✨" }
];

export const occasions = [
  { id: "maternidade", name: "Maternidade", icon: "👶" },
  { id: "cha-bebe", name: "Chá de Bebê", icon: "🍼" },
  { id: "batizado", name: "Batizado", icon: "⛪" },
  { id: "casamento", name: "Casamento", icon: "💒" },
  { id: "aniversario", name: "Aniversário", icon: "🎂" },
  { id: "corporativo", name: "Corporativo", icon: "🏢" }
];

export const states = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
