export interface AccessResult {
  accessGranted: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    profilePictureUrl?: string;
  };
  plan?: string;
}