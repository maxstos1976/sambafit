export interface Product {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  color: string;
  collection: string;
  sizes: string[];
  stock: Record<string, number>;
}

export interface Collection {
  _id?: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  isGiftCard?: boolean;
  giftCardId?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ipanema Performance Leggings',
    price: 89,
    category: 'Leggings',
    image: 'https://valking.com/cdn/shop/files/Leggings_compresivos_fucsia_y_top_blanco-ingrid.jpg',
    description: 'High-compression fabric inspired by the curves of Rio.',
    color: 'Deep Ocean Blue',
    collection: 'Mangueira',
    sizes: ['XXS', 'XS', 'M', 'L', 'XL', 'XXL'],
    stock: { 'XXS': 5, 'XS': 10, 'M': 15, 'L': 12, 'XL': 8, 'XXL': 4 }
  },
  {
    id: '2',
    name: 'Amazonia Breathable Bra',
    price: 55,
    category: 'Tops',
    image: 'https://es.yeoreo.com/cdn/shop/files/yeoreo_tops_women_White_5014_2_6a2fb2e3-71ca-49e8-a4b0-61d3298fd971.jpg',
    description: 'Lightweight support for high-intensity movement.',
    color: 'Forest Green',
    collection: 'Beija-Flor',
    sizes: ['XS', 'M', 'L', 'XL'],
    stock: { 'XS': 12, 'M': 20, 'L': 15, 'XL': 10 }
  },
  {
    id: '3',
    name: 'Samba Rhythm Shorts',
    price: 45,
    category: 'Shorts',
    image: 'https://es.yeoreo.com/cdn/shop/files/yeoreo_shorts_women_Navy_4200_1.jpg',
    description: 'Move freely with our signature moisture-wicking tech.',
    color: 'Tropical Orange',
    collection: 'Beija-Flor',
    sizes: ['XXS', 'XS', 'M', 'L', 'XL', 'XXL'],
    stock: { 'XXS': 8, 'XS': 15, 'M': 25, 'L': 20, 'XL': 12, 'XXL': 6 }
  },
  {
    id: '4',
    name: 'Carioca Zip Jacket',
    price: 120,
    category: 'Jackets',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTgeAyPu0HCn3StXcGUWSLkPKbHnsfU2XBYp-mL0NH6lCicgrB_SSpIGcn6ZDx9EiwISuNzUcfdz57ovBbtfjF-reE_ua0tzzWKn9ElhEGLOGYiKuWrYfQTkLU',
    description: 'The perfect layer for post-workout sunset walks.',
    color: 'Sand Beige',
    collection: 'Portela',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: { 'M': 10, 'L': 15, 'XL': 10, 'XXL': 5 }
  },
  {
    id: '5',
    name: 'Bahia Flow Tank',
    price: 38,
    category: 'Tops',
    image: 'https://es.yeoreo.com/cdn/shop/files/yeoreo_tops_women_White_5014_2_6a2fb2e3-71ca-49e8-a4b0-61d3298fd971.jpg',
    description: 'Soft, sustainable bamboo fabric that breathes with you.',
    color: 'Sunset Yellow',
    collection: 'Beija-Flor',
    sizes: ['XXS', 'XS', 'M', 'L'],
    stock: { 'XXS': 5, 'XS': 10, 'M': 15, 'L': 10 }
  },
  {
    id: '6',
    name: 'Leblon Sculpt Bodysuit',
    price: 110,
    category: 'Bodys',
    image: 'https://es.yeoreo.com/cdn/shop/files/yeoreo_Jumpsuits_women_Dark_Grey_8561_4_65735e0d-5d6c-49a0-a5ab-a6000a364097.jpg',
    description: 'Seamless construction for a second-skin feel.',
    color: 'Midnight Black',
    collection: 'Unidos da Tijuca',
    sizes: ['XS', 'M', 'L'],
    stock: { 'XS': 10, 'M': 15, 'L': 12 }
  },
  {
    id: '7',
    name: 'Copacabana Speed Leggings',
    price: 95,
    category: 'Leggings',
    image: 'https://valking.com/cdn/shop/files/Leggings_compresivos_fucsia_y_top_blanco-ingrid.jpg',
    description: 'Aerodynamic design for maximum velocity.',
    color: 'Electric Blue',
    collection: 'Mangueira',
    sizes: ['XXS', 'XS', 'M', 'L', 'XL', 'XXL'],
    stock: { 'XXS': 6, 'XS': 12, 'M': 18, 'L': 15, 'XL': 10, 'XXL': 5 }
  },
  {
    id: '8',
    name: 'Sugarloaf Peak Vest',
    price: 75,
    category: 'Jackets',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTgeAyPu0HCn3StXcGUWSLkPKbHnsfU2XBYp-mL0NH6lCicgrB_SSpIGcn6ZDx9EiwISuNzUcfdz57ovBbtfjF-reE_ua0tzzWKn9ElhEGLOGYiKuWrYfQTkLU',
    description: 'Lightweight insulation for early morning climbs.',
    color: 'Cloud White',
    collection: 'Mangueira',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: { 'M': 10, 'L': 15, 'XL': 10, 'XXL': 5 }
  },
  {
    id: '9',
    name: 'Top Ginga',
    price: 58,
    category: 'Tops',
    image: 'https://es.yeoreo.com/cdn/shop/files/yeoreo_tops_women_White_5014_2_6a2fb2e3-71ca-49e8-a4b0-61d3298fd971.jpg',
    description: 'Rhythmic support for your most intense moves.',
    color: 'Vibrant Red',
    collection: 'Mangueira',
    sizes: ['XS', 'M', 'L'],
    stock: { 'XS': 10, 'M': 15, 'L': 12 }
  },
  {
    id: '10',
    name: 'Legging Pulse',
    price: 92,
    category: 'Leggings',
    image: 'https://valking.com/cdn/shop/files/Leggings_compresivos_fucsia_y_top_blanco-ingrid.jpg',
    description: 'Feel the beat of the city with every stride.',
    color: 'Neon Pink',
    collection: 'Beija-Flor',
    sizes: ['XXS', 'XS', 'M', 'L', 'XL'],
    stock: { 'XXS': 5, 'XS': 10, 'M': 15, 'L': 12, 'XL': 8 }
  },

  // ... segue o mesmo padrão até o item 25, mantendo TUDO igual ao original
  // e alterando somente "collection"

];
