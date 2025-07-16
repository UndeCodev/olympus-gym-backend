export interface EmployeeSearchResult {
  employees: Array<{
    id: number;
    isActive: boolean;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
      birthDate: Date | null;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}