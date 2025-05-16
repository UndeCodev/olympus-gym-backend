export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  status: ProductStatus;
  images?: {
    url: string;
    publicId: string;
    isPrimary?: boolean;
  }[];
}

export enum ProductStatus {
  STOCK,
  LOW_STOCK,
  UNAVAILABLE,
}
