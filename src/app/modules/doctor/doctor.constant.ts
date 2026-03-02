import { Prisma } from "@prisma/client"

export const doctorFilterableFields=["name","consultationFee","searchTerm","specializations.specialization.name","specializations.specialization.categoryId"]
export const doctorSearchableFields=[
"qualification","designation", "currentWorkingPlace","registrationNumber","user.name","specializations.specialization.name"
]
export const doctorOptionsFields=[
"page", "limit", "sortBy", "sortOrder"
]
export const doctorIncludeConfig : Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> ={
    user: true,
    specializations: {
        include:{
            specialization: true
        }
    },
}