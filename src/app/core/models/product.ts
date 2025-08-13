// src/app/core/models/product.ts
import { Review } from './review';

export interface Product {
  id: number;
  name: string;
  description: string;
  detailedDescription?: string;
  imageUrl?: string;
  basePrice: number;
  category?: string;
  technicalSpecs?: string;
  isActive: boolean;
  createdAt: Date;

  // AGREGAR ESTA LÍNEA:
  manualContent?: string; // Contenido HTML del manual

  materials: ProductMaterial[];
  reviews: Review[];
  averageRating: number;
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
