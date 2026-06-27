export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  originalPrice?: number;
  karat: string;
  weight: string;
  rating: number;
  reviews: number;
  images: string[];
  category: string;
  tag?: string;
  isNew?: boolean;
  inStock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "ست طلای کره‌ای پاپیون (بافت دار)",
    desc: "گردنبند و گوشواره طلا طرح پاپیون بافت‌دار — ظریف و دخترانه",
    price: 4_850_000,
    originalPrice: 6_200_000,
    karat: "۱۸ عیار",
    weight: "۳.۲ گرم",
    rating: 4.9,
    reviews: 84,
    images: ["/products/p1.jpg", "/products/p2.jpg"],
    category: "set",
    isNew: true,
    inStock: 3,
  },
  {
    id: 2,
    name: "ست طلای قلب ظریف",
    desc: "گردنبند و گوشواره طلا طرح قلب توخالی — کلاسیک و عاشقانه",
    price: 3_900_000,
    karat: "۱۸ عیار",
    weight: "۲.۸ گرم",
    rating: 4.8,
    reviews: 112,
    images: ["/products/p3.jpg"],
    category: "set",
    tag: "پرفروش",
    inStock: 7,
  },
  {
    id: 3,
    name: "ست طلای پاپیون سیمی",
    desc: "گردنبند و گوشواره طلا طرح پاپیون سیمی — مینیمال و شیک",
    price: 4_200_000,
    originalPrice: 5_500_000,
    karat: "۱۸ عیار",
    weight: "۳.۰ گرم",
    rating: 4.7,
    reviews: 67,
    images: ["/products/p4.jpg"],
    category: "set",
    isNew: true,
    inStock: 5,
  },
  {
    id: 4,
    name: "ست طلای سه‌قلب (گل‌آفتابگردان)",
    desc: "گردنبند و گوشواره طلا طرح سه‌قلب تراش‌دار — منحصربه‌فرد",
    price: 5_100_000,
    originalPrice: 6_800_000,
    karat: "۱۸ عیار",
    weight: "۴.۱ گرم",
    rating: 4.9,
    reviews: 43,
    images: ["/products/p5.jpg"],
    category: "set",
    isNew: true,
    inStock: 2,
  },
];

export function getProductById(id: number) {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(cat: string) {
  if (cat === "all") return products;
  return products.filter(p => p.category === cat);
}
