export interface MyMembershipStatusResponse {
  hasActiveMembership: boolean;
  planName: string | null;     
  endDate: string | null;      
  status: string;              
  qrToken: string | null;     
  securityNote: string;       
}