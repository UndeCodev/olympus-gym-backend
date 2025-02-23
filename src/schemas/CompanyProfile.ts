import { z } from 'zod'

const socialMediaSchema = z
  .object({
    facebook: z.string().url('Invalid URL for Facebook'),
    twitter: z.string().url('Invalid URL for Twitter'),
    instagram: z.string().url('Invalid URL for Instagram')
  })
  .strict()

export const companyProfileSchema = z.object({
  id: z.coerce
    .number({
      invalid_type_error: 'id must be a number',
      required_error: 'id is required'
    })
    .min(1, 'Min value expected 1'),
  name: z
    .string({
      invalid_type_error: 'name must be a string',
      required_error: 'name is required'
    })
    .min(3, 'Company name must have at least 3 characters'),
  slogan: z
    .string({
      invalid_type_error: 'slogan must be a string',
      required_error: 'slogan is required'
    })
    .min(5, 'Slogan must have at least 5 characters')
    .max(100, 'Slogan cannot exceed 100 characters'),
  address: z
    .string({
      invalid_type_error: 'address must be a string',
      required_error: 'address is required'
    })
    .min(10, 'Address must have at least 10 characters'),
  zip: z
    .string({
      invalid_type_error: 'zip must be a string',
      required_error: 'zip is required'
    })
    .regex(/^\d{5}$/, 'Invalid ZIP code. Must be 5 digits'),
  phoneNumber: z
    .string({
      invalid_type_error: 'phoneNumber must be a string',
      required_error: 'phoneNumber is required'
    })
    .regex(
      /^(\+52\s?)?(\d{2,3})?-?\d{3}-?\d{4}$/,
      'Invalid Mexican phone number format'
    ),
  email: z
    .string({
      invalid_type_error: 'email must be a string',
      required_error: 'email is required'
    })
    .email('Invalid email format'),

  socialMedia: z.coerce
    .string()
    .transform((val) => JSON.parse(val) as Record<string, string>)
    .superRefine((parsed, ctx) => {
      const result = socialMediaSchema.safeParse(parsed)
      if (!result.success) {
        result.error.issues.forEach((issue) => ctx.addIssue(issue))
      }
    })
})
