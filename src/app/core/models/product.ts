export interface Product {
  id: number;
  name: string;
  description: string;
  detailedDescription?: string;
  basePrice: number;
  imageUrl?: string;
  materials: ProductMaterial[];
  faqs: ProductFaq[];
  reviews: Review[];
  averageRating: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ProductMaterial {
  materialId: number;
  materialName: string;
  quantity: number;
  unitCost: number;
}

export interface ProductFaq {
  id: number;
  productId: number;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateProductFaq {
  question: string;
  answer: string;
}
