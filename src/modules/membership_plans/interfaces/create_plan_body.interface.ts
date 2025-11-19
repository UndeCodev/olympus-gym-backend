export interface CreatePlanBody {
  name: string;
  description?: string;
  price: number;
  durationMonths: number;
}