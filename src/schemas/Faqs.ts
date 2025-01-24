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
    answer: z
        .string({
            invalid_type_error: 'Answer must be a string',
            required_error: 'Answer is required',
        })
        .min(1, 'Question must be at least 5 characters long')
        .trim(),
});

//validacion para obtener un rango de FAQs 
export const validateRangeInFAQs = z.object({
    start: z
        .number({
            invalid_type_error: 'Value start required a number',
            required_error: 'Value start is required',
        })
        .min(1, 'The minimum to list must be 1'), // Mínimo es 1
    end: z
        .number({
            invalid_type_error: 'Value end required a number',
            required_error: 'Value end is required',
        })
        .max(5, 'The maximum to list must be 5'), // Máximo es 5
    })
    .superRefine((data, ctx) => {
        if (data.end < data.start) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Value end must be greater than or equal to value start',
            path: ['end'], // Especifica el campo con el problema
        });
    }
})

// Esquema para actualizar una FAQ (permite actualizar solo la respuesta)
export const faqUpdateSchema = z.object({
    question: z
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


