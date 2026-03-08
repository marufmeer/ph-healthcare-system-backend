import { z } from "zod";

export const scheduleGenerateSchema = z.object({
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "startDate must be a valid date",
    }),

  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "endDate must be a valid date",
    }),


  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "startTime must be in HH:MM format (24-hour)",
    }),

  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "endTime must be in HH:MM format (24-hour)",
    }),

  duration: z
    .number()
    .int()
    .positive("duration must be a positive integer"),
});