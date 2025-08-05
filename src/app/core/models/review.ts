export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}
