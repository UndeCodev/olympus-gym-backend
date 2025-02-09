import {z}from 'zod';

// Enum for product status based on Prisma
const statusEnum = z.enum(["AVAILABLE", "OUT_OF_STOCK"]);

// Schema for product validation
export const productCreationSchema = z.object({
    name: z
        .string({
            invalid_type_error: 'Product name must be a string',
            required_error: 'Product name is required',
        })
        .min(3, 'Product name must be at least 3 characters long')
        .trim(),

    description: z
        .string({
            invalid_type_error: 'Description must be a string',
            required_error: 'Product description is required',
        })
        .min(10, 'Description must be at least 10 characters long')
        .trim(),

    price: z
        .union([
            z.number({
                invalid_type_error: 'Price must be a number',
                required_error: 'Product price is required',
            }),
            z.string().transform((val) => parseFloat(val)), // Allow string numbers and convert them
        ])
        .refine((val) => val > 0, { message: 'Price must be greater than 0' }),

    stockAvailable: z
        .number({
            invalid_type_error: 'Stock must be a number',
            required_error: 'Stock quantity is required',
        })
        .int('Stock quantity must be an integer')
        .min(0, 'Stock quantity cannot be negative'),

    dateAdded: z
        .date({
            invalid_type_error: 'Date must be a valid date type',
            required_error: 'Date added is required',
        })
        .default(() => new Date()), // Default to current date

    status: statusEnum, // Validate status based on enum

    categoryId: z
        .number({
            invalid_type_error: 'Category ID must be a number',
            required_error: 'Category ID is required',
        })
        .int('Category ID must be an integer')
        .positive('Category ID must be a positive number'),
});

// Esquema de validación para actualizar productos
export const productUpdateSchema = z.object({
    name: z
        .string()
        .min(3, 'Product name must be at least 3 characters long')
        .trim(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters long')
        .trim(),
    price: z.union([
        z.number(),
        z.string().transform((val) => parseFloat(val))
    ]).refine((val) => val > 0, { message: 'Price must be greater than 0' }),
    stockAvailable: z
        .number()
        .int()
        .min(0, 'Stock quantity cannot be negative'),
    dateAdded: z
        .union([
          z.date(), // Permite objetos Date válidos
          z.string().transform((val) => new Date(val)) // Convierte strings a Date
        ])
        .refine((val) => !isNaN(val.getTime()), { message: "Invalid date format" }) // Verifica que sea una fecha válida
        .optional(), // Opcional en actualizaciones      
    status: statusEnum,
    categoryId: z
        .number()
        .int()
        .positive('Category ID must be a positive number'),
});



// schema for pagination validation
export const paginationSchema = z.object({
  page: z
    .number({
      required_error: "Page is required",
      invalid_type_error: "Page must be a number",
    })
    .int("Page must be an integer")
    .positive("Page must be a positive number")
    .default(1),

  limit: z
    .number({
      required_error: "Limit is required",
      invalid_type_error: "Limit must be a number",
    })
    .int("Limit must be an integer")
    .positive("Limit must be a positive number")
    .max(50, "Limit cannot be greater than 100") 
    .default(20),
});

// Schema for search query and pagination validation
export const searchSchema = z.object({
    query: z
        .string({
            required_error: "Query parameter is required",
            invalid_type_error: "Query must be a string"
        })
        .min(1, "Query must not be empty")
        .trim(),

    page: z
        .number({
            required_error: "Page is required",
            invalid_type_error: "Page must be a number",
        })
        .int("Page must be an integer")
        .positive("Page must be a positive number")
        .default(1), // Default to page 1 if not provided

    limit: z
        .number({
            required_error: "Limit is required",
            invalid_type_error: "Limit must be a number",
        })
        .int("Limit must be an integer")
        .positive("Limit must be a positive number")
        .max(50, "Limit cannot be greater than 50")
        .default(20),
});

// Function to validate product input
export function validateProduct(input: any) {
    const result = productCreationSchema.safeParse(input);
    
    return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error.format() };
}

// Function to validate product updates
export function validateProductUpdate(input: any) {
    const result = productUpdateSchema.safeParse(input);
    
    return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error.format() };
}