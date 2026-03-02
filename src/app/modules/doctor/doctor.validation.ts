import z from "zod";
import { GenderSchema } from "../../interfaces/enum.validator";
import { dateOfBirthSchema } from "../../zodHelpers/helperZodSchema";


export const BecomeDoctorSchema=z.object({
  gender:GenderSchema,
  dateOfBirth:dateOfBirthSchema,
 specializationIds:z.string().array().min(1,"At least one specialization required"),
qualification: z.string().min(1, "Qualification is required"),
  experienceYears: z.number().int().nonnegative(),
  currentWorkingPlace: z.string().min(1, "Current working place is required"),
  designation: z.string().min(1, "Designation is required"),
  consultationFee:z.number().nonnegative() 
    })