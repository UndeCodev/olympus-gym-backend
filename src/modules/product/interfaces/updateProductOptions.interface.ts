export interface UpdateProductOptions {
  deletedImages?: number[];
  newPrimaryImageId?: number;
  newImages?: Express.Multer.File[];
}
