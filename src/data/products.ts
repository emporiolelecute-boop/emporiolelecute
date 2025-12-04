export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
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
    name: "Sabonete Margarida na Caixinha",
    description: "Sabonetes artesanais em formato de margarida, decorados e embalados em caixinhas elegantes. Perfeitos como lembrancinhas personalizadas de chá de bebê, maternidade ou aniversário. Feito com matéria-prima hipoalergênica.",
    price: "R$ 4,60",
    image: "https://img.elo7.com.br/product/685x685/50E237C/lembrancinha-margarida-na-caixinha-lembrancinha-sabonete-maternidade.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-margarida-na-caixinha/dp/1FB93C8",
    badge: "Mais Vendido",
    rating: 5,
    category: "sabonetes",
    occasions: ["maternidade", "cha-bebe", "aniversario"],
    keywords: ["margarida", "flor", "caixinha", "elegante", "feminino"]
  },
  {
    id: "2",
    name: "Vela Margarida Perfumada",
    description: "Mini vela perfumada em formato de margarida com cartão personalizado. Produzida com cera vegetal e pavio de algodão, esta vela aromática traz charme a qualquer decoração. Ideal para lembrancinhas de casamento ou maternidade.",
    price: "R$ 7,60",
    originalPrice: "R$ 8,50",
    image: "https://img.elo7.com.br/product/685x685/54800D6/lembrancinha-sabonete-margarida-na-caixinha-margarida.jpg",
    link: "https://www.elo7.com.br/vela-margarida-perfumada-cartao-personalizado/dp/1FB93E2",
    badge: "Promoção",
    rating: 5,
    category: "velas",
    occasions: ["casamento", "maternidade", "aniversario"],
    keywords: ["vela", "perfumada", "margarida", "aroma", "decoração"]
  },
  {
    id: "3",
    name: "Sabonete Borboleta + Letra + Coração",
    description: "Lindo conjunto de sabonetes artesanais com borboleta, letra personalizada e mini coração. Embalagem delicada ideal para chá de bebê, aniversário infantil ou maternidade. Personalização completa de cores e aromas.",
    price: "R$ 4,60",
    image: "https://img.elo7.com.br/product/685x685/548B92C/lembrancinha-sabonete-borboleta-letra-coracao.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-borboleta-letra-coracao/dp/1FB93BF",
    badge: "Personalizável",
    rating: 5,
    category: "sabonetes",
    occasions: ["cha-bebe", "maternidade", "aniversario"],
    keywords: ["borboleta", "letra", "coração", "personalizado", "infantil"]
  },
  {
    id: "4",
    name: "Kit Sabonete Rosa + Tag",
    description: "Sabonete artesanal em formato de rosa com tag personalizada. Embalagem elegante com laço de cetim. Perfeito para lembrancinhas de casamento, chá de panela ou eventos corporativos.",
    price: "R$ 5,90",
    image: "https://img.elo7.com.br/product/685x685/5232E3C/lembrancinha-sabonete-rosa-lembrancinha-casamento.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-rosa/dp/1FB93D5",
    rating: 5,
    category: "kits",
    occasions: ["casamento", "corporativo"],
    keywords: ["rosa", "flor", "elegante", "cetim", "sofisticado"]
  },
  {
    id: "5",
    name: "Sabonete Ursinho Bebê",
    description: "Adorável sabonete em formato de ursinho, perfeito para lembrancinhas de maternidade e chá de bebê. Feito com fórmula hipoalergênica e fragrâncias suaves, seguro para bebês e mamães.",
    price: "R$ 4,20",
    image: "https://img.elo7.com.br/product/685x685/506FA16/lembrancinha-sabonete-ursinho-lembrancinha-maternidade.jpg",
    link: "https://www.elo7.com.br/lembrancinha-sabonete-ursinho/dp/1FB93CA",
    badge: "Novidade",
    rating: 5,
    category: "sabonetes",
    occasions: ["maternidade", "cha-bebe"],
    keywords: ["ursinho", "bebê", "fofo", "infantil", "delicado"]
  },
  {
    id: "6",
    name: "Vela Perfumada Coração",
    description: "Vela decorativa em formato de coração com fragrância suave e duradoura. Ideal para lembrancinhas de casamento, dia dos namorados ou eventos românticos. Embalagem personalizada disponível.",
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
    name: "Kit Batizado Anjinho",
    description: "Lembrancinha especial de batizado com sabonete em formato de anjinho e tag personalizada. Embalagem delicada em tons de branco e azul ou rosa. Símbolo de proteção e fé.",
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
    name: "Sabonete Estrela Glitter",
    description: "Sabonete artesanal em formato de estrela com acabamento glitter. Brilho especial para festas infantis, chá de revelação ou aniversários. Disponível em várias cores e fragrâncias.",
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
    name: "Mini Vela Flor de Lótus",
    description: "Elegante mini vela em formato de flor de lótus flutuante. Ideal para decoração de eventos, centro de mesa ou lembrancinha sofisticada. Aroma suave e relaxante.",
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
    name: "Kit Corporativo Personalizado",
    description: "Kit especial para brindes corporativos com sabonete e vela personalizados com logo da empresa. Embalagem premium com acabamento profissional. Ideal para eventos empresariais e presentes de fim de ano.",
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
    name: "Vela Perfumada Lavanda",
    description: "Vela aromática com essência de lavanda real. Embalagem rústica com tag personalizada. Ideal para lembrancinhas de chá de panela, despedida de solteira ou eventos wellness.",
    price: "R$ 7,20",
    image: "https://img.elo7.com.br/product/685x685/5501E8C/lembrancinha-vela-lavanda-aromatica.jpg",
    link: "https://www.elo7.com.br/lembrancinha-vela-lavanda/dp/1FB93DD",
    rating: 5,
    category: "velas",
    occasions: ["casamento", "aniversario"],
    keywords: ["lavanda", "aroma", "relaxante", "rústico", "natural"]
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
