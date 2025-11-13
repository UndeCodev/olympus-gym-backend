export interface UploadProfilePictureResponse {
  success: boolean;
  message: string;
  profilePictureUrl: string;
}

export interface UpdateProfilePictureData {
  userId: number;
  profilePictureUrl: string;
  publicId: string;
}