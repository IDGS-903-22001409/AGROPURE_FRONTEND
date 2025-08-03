export interface Material {
  id: number;
  name: string;
  description: string;
  unitCost: number;
  unit: string;
  supplierId: number;
  supplierName: string;
  isActive: boolean;
}
