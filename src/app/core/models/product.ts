export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  materials: ProductMaterial[];
  isActive: boolean;
  createdAt: Date;
}

export interface ProductMaterial {
  materialId: number;
  materialName: string;
  quantity: number;
  unitCost: number;
}
