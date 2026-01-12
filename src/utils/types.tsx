interface Category {
  description: string;
  id: string;
  name: string;
  slug: string;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  material: string;
  images: ProductImage[];
  price: number;
  quantity: number;
  category: Category;
  imageSizes?: string;
  slug: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder?: number;
}
