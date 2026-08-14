export interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string;
  is_available: boolean;
  is_featured: boolean;
  product_images: ProductImage[];
}
