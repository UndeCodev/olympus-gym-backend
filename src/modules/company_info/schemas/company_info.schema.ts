import { z } from 'zod';

const scheduleItemSchema = z.object({
  days: z.string(),
  open: z.string(),
  close: z.string(),
});

const socialMediaSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'tiktok', 'twitter', 'youtube', 'linkedin']),
  url: z.string().url(),
});

export const updateCompanyInfoSchema = z.object({
  logo: z.string().url().optional(),
  name: z.string().min(1).optional(),
  slogan: z.string().optional(),
  address: z.string().min(1).optional(),
  zip: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  schedule: z.array(scheduleItemSchema).optional(),
  socialMedia: z.array(socialMediaSchema).optional(),
});
