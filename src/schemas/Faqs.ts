import z from 'zod';
import { ValidationSchemaResult } from '../types';

// Esquema para crear una FAQ (solo requiere pregunta)
export const faqCreationSchema = z.object({
    question: z
        .string({
            invalid_type_error: 'Question must be a string',
            required_error: 'Question is required',
        })
        .min(5, 'Question must be at least 5 characters long')
        .trim(),
});

// Esquema para actualizar una FAQ (permite actualizar solo la respuesta)
export const faqUpdateSchema = z.object({
    answer: z
        .string({
            invalid_type_error: 'Answer must be a string',
            required_error: 'Answer is required',
        })
        .min(1, 'Answer must be at least 10 characters long')
        .trim(),
});

// Validación para crear FAQs
export const validateFaqCreation = (data: unknown): ValidationSchemaResult => {
    const result = faqCreationSchema.safeParse(data);

    return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error };
};

// Validación para actualizar FAQs
export const validateFaqUpdate = (data: unknown): ValidationSchemaResult => {
    const result = faqUpdateSchema.safeParse(data);

    return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error };
};
