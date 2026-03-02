import { UserRole } from "@prisma/client";
import z from "zod";


export const passwordUpdateSchema=z.object({
oldPassword:z.string().min(8,"Password is required."),
newPassword:z.string().regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,"Password should be at least 8 character length and one special character."), 
})

export const switchRoleSchema=z.object({
activeRole:z.enum([...Object.values(UserRole)])
})