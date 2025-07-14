import { z } from "zod";

export const createReservationSchema = z.object({
    cartId: z.coerce.number().positive(),
    userId: z.coerce.number().positive(),
})