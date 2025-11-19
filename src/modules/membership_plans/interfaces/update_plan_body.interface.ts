export interface UpdatePlanBody {
  name?: string;
  description?: string;
  price?: number;
  durationMonths?: number;
  isActive?: boolean;
}