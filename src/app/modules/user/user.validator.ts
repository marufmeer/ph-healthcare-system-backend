import { UserStatus } from "@prisma/client";
import { z } from "zod";
import { BecomePatientSchema } from "../patient/patient.validate";
import { GenderSchema } from "../../interfaces/enum.validator";
import { dateOfBirthSchema } from "../../zodHelpers/helperZodSchema";
import { BecomeDoctorSchema } from "../doctor/doctor.validation";



/* ================= User ================= */
export const UserSchema = z.object({
    name: z.string().trim().min(1, "Name is required").transform(str => 
  str
    .replace(/["',]/g, '') 
    .replace(/\s+/g, ' ') ),
  email:z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
password: z.string().regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,"Password should be at least 8 character length and one special character."),  
});



/* ================= Patient ================= */
export const PatientSchema=UserSchema.extend({
  patient:BecomePatientSchema
})

/* ================= DOCTOR ================= */
export const DoctorSchema = UserSchema.extend({
 doctor:BecomeDoctorSchema
})

/* ================= ADMIN ================= */
export const AdminSchema = z.object({
     ...UserSchema.shape,
     phoneNumber:z.string().min(11,"Phone number is required")
  .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
    message: "Invalid Bangladeshi phone number",
  })
});

/* ================= ASSISTANT ================= */
export const AssistantSchema = z.object({
   ...UserSchema.shape,
    assistant:z.object({
      gender:GenderSchema,
specializationIds:z.string().array().min(1,"At least one specialization required"),
  qualification: z.string().min(1, "Qualification is required"),
  assistedFee:z.number().nonnegative() 
    })
});
/* ================= Update Profile================= */
export const updateProfileSchema=z.object({
    name: z.string().min(1, "Name is required").optional(),
   phoneNumber:z.string().min(11,"Phone number is required")
  .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
    message: "Invalid Bangladeshi phone number",
  }).optional()
})
/* ================= Update Status================= */
export const updateStatus = z.object({
status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
});
