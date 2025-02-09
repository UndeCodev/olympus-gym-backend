import z from "zod";

// Schema for creating a new category
export const categoryCreationSchema = z.object({
    name: z
        .string({
            invalid_type_error: "Category name must be a string",
            required_error: "Category name is required",
        })
        .min(3, "Category name must be at least 3 characters long")
        .max(50, "Category name must be at most 50 characters long")
        .trim(),
});

// Schema for updating a category (fields are optional)
export const categoryUpdateSchema = categoryCreationSchema.partial();

// Function to validate category input
export function validateCategory(input: any) {
    const result = categoryCreationSchema.safeParse(input);

    return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error.format() };
}

// Function to validate category update
export function validateCategoryUpdate(input: any) {
    const result = categoryUpdateSchema.safeParse(input);

    return result.success
        ? { success: true, data: result.data }
        : { success: false, error: result.error.format() };
}
