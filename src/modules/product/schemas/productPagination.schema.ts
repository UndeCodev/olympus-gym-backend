import { z } from 'zod';

export const productSearchSchema = z.object({
  searchTerm: z.string().min(3, 'El término de búsqueda debe tener al menos 3 caracteres'),
});
