import { UserRole } from "@prisma/client";

export const roleSwitchRules:Record<UserRole,UserRole[]>={
    USER:[UserRole.PATIENT,UserRole.DOCTOR,UserRole.ASSISTANT],
    PATIENT:[UserRole.DOCTOR,UserRole.ASSISTANT],
    DOCTOR:[UserRole.PATIENT,UserRole.ASSISTANT],
    ASSISTANT:[UserRole.PATIENT,UserRole.DOCTOR],
    ADMIN:[],
    SUPER_ADMIN:[]
}

export const role_profile_map: Record<string,string>={
  DOCTOR: "doctor",
  PATIENT: "patient",
  ADMIN: "admin",
  SUPER_ADMIN:"admin",
  ASSISTANT: "assistant",
}