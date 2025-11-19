export interface CreateMembershipData {
  userId: number;
  planId: number;
  startDate: Date;
  endDate: Date;
  pricePaid: number;
  paymentRef?: string;
}