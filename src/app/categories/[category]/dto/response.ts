interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  weight: number;
  material: string;
  images: ProductImage[];
  category: Category;
  specifications: Record<string, any>;
  isActive: boolean;
  allowBackOrder: boolean;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  careInstructions: string;
  isOnSale: boolean;
  salePrice: number;
  customizationOptions: Record<string, any>;
  metaTitle: string;
  metaDescription: string;
}

interface ApiResponse {
  data: Product[];
  message: string;
}
