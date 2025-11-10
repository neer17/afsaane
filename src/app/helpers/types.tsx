export interface Product {
  id: string;
  images: string[];
  name: string;
  price: number;
  quantity?: number;
  category: string;
  imageSizes?: string;
  slug?: string;
}
