import * as z from 'zod';

export const appointmentSchema = z.object({
    name: z.string(),
    birthDate: z.date(),
    scheduledDate: z.date(),
    id: z.string().optional(),
    situation: z.string().default("Undone"),
    conclusion: z.string().optional(),
  });