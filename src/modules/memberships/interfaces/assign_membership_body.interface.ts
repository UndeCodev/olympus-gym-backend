export interface AssignMembershipBody {
  userId: number;
  planId: number;
  paymentRef?: string;
  startDate?: string;
}