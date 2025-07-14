export interface UpdateProductOptions {
  deletedImages?: number[];
  newImages?: Express.Multer.File[];
  newPrimaryImageId?: number;
  existingPrimaryImageId?: number; 
}
