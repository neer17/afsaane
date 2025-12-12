export interface Product {
  id: string;
  name: string;
  description: string;
  material: string;
  images: ProductImage[];
  price: number;
  quantity: number;
  category: string;
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
