import z from 'zod';

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

const validateRangeInFAQs = z.object({
    start: z
      .number({
        invalid_type_error: "Value start must be a number",
        required_error: "Value start is required",
      })
      .min(1, "Value start must be at least 1"), // Min 1

    end: z
      .number({
        invalid_type_error: "Value end must be a number",
        required_error: "Value end is required",
      })
      .min(1, "Value end must be at least 1"), // Min 1
  })
  .refine((data) => data.end >= data.start, {
    message: "Value end must be greater than or equal to start",
    path: ["end"],
  });


export function validateFAQInRange(input: any) {
    const result = validateRangeInFAQs.safeParse(input);
    
    return result.success
        ?{succes: true, data: result.data}
        :{sucess: false, error: result.error.format()}
}


export const faqUpdateSchema = z.object({
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
        .min(1, 'Answer must be at least 1 characters long')
        .trim(),
});

