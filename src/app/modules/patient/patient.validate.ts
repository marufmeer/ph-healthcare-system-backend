import z from "zod";
import { bloodGroupSchema, GenderSchema, MaritalStatusEnum } from "../../interfaces/enum.validator";
import { dateOfBirthSchema } from "../../zodHelpers/helperZodSchema";




export const BecomePatientSchema=z.object({
  gender:GenderSchema,
  dateOfBirth: dateOfBirthSchema,
  bloodGroup: bloodGroupSchema,
  height: z.number().positive().min(30, { message: "Height must be at least 30 cm" })
  .max(300, { message: "Height must be at most 300 cm" }),
  weight: z.number().positive().min(1, { message: "Weight must be at least 1 kg" })
  .max(500, { message: "Weight must be at most 500 kg" })
  ,
hasAllergies: z.boolean().optional(),
  hasDiabetes: z.boolean().optional(),
  smokingStatus: z.boolean().optional(),
  pregnancyStatus: z.boolean().optional(),
  hasPastSurgeries: z.boolean().optional(),
  recentAnxiety: z.boolean().optional(),
  recentDepression: z.boolean().optional(),

  dietaryPreferences: z
    .string()
    .max(200, "Dietary preferences too long")
    .optional(),

  mentalHealthHistory: z
    .string()
    .max(500, "Mental health history too long")
    .optional(),

  immunizationStatus: z
    .string()
    .max(300, "Immunization status too long")
    .optional(),

  maritalStatus:MaritalStatusEnum.optional(),
   })
   export const UpdatePatientSchema = BecomePatientSchema
  .partial()
  .refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" }
  );