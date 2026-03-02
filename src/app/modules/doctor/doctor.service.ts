import { Doctor, Patient, Prisma, Status, UserRole, UserStatus } from '@prisma/client';
import { paginationHelper } from '../../helpers/paginationHelper'; 
import { prisma } from '../../../shared/prisma';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../../errors/appError';
import httpStatus from "http-status-codes"
import pick from '../../helpers/pick';
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from './doctor.constant';
import { QueryBuilder } from '../../helpers/queryBuilder';

const becomeDoctor = async (
req:Request
) => {
const decodedToken=req.user as JwtPayload 
const {specializationIds,...payload}=req.body 
const user=await prisma.user.findUniqueOrThrow({
  where:{
    email:decodedToken.email
  },
  include:{
    doctor:true
  }
 
})
 if(user.doctor){
  throw new AppError(httpStatus.BAD_REQUEST,"User is already a doctor.")
 } 
  const doctor = await prisma.$transaction(async (tx) => {
    const newDoctor = await tx.doctor.create({
      data: {
        ...payload,
        userId: user.userId,
        status:Status.PENDING
      },
    });
    const createSpecializations=await tx.doctorSpecialization.createMany({
        data:specializationIds.map((specialization:string)=>({
         specializationId:specialization,
         doctorId:newDoctor.doctorId   
        }))
    })
    return {newDoctor,createSpecializations};
  });
  return doctor
};
const getAllFromDB = async (
params:any
) => {
 
   const queryBuilder = new QueryBuilder(
        prisma.doctor,
        params,
        {
            searchableFields: doctorSearchableFields,
            filterableFields: doctorFilterableFields,
        }
    )
    const result=await queryBuilder.search().filter().include( {user: true,
    specializations: {
        include:{
            specialization: true
        }
    },}).dynamicInclude(doctorIncludeConfig).paginate().sort().fields().execute()
    return result
};
// const getAllFromDB = async (
// params:any,options:Record<string,unknown>
// ) => {
//   const {searchTerm,...filter}=params

//   const andConditions:Prisma.DoctorWhereInput[]=[]
//    if(searchTerm){
// andConditions.push({
//    OR:[
//     ...doctorSearchableFields.map(field => ({
//       [field]: {
//         contains: searchTerm,
//         mode: "insensitive",
//       },
//     })),
//     {
//           user: {
//             name: {
//               contains: searchTerm,
//               mode: "insensitive",
//             },
//           },
//         }
//   ]  
// })
//    }
//       if(Object.keys(filter).length>0){
//      andConditions.push({
//       AND:[
//         {
// specializations:{
//           some:{
// specialization:{
//          category:{
//              categoryName:{
//               equals:filter.categoryName
//              }
//           }
//          }
//         }
//         }
//         },
//       {
//         specializations:{
//           some:{
// specialization:{
//           name:{
//              equals:filter.specialization
//           }
//          }
//         }
//         }
//       }
//     ]
//      }) 
//     }  
//     const whereConditions:Prisma.DoctorWhereInput=andConditions.length>0?{
//       AND:andConditions
//     }:{}
//     const result=await prisma.doctor.findMany({
//       where:whereConditions,
//       include:{
//         user:true,
//         specializations:{
//           include:{
//             specialization:true
//           }
//         }
//       }
//     })
//     return result
// };

const updateIntoDB = async (req:Request,decodedToken:JwtPayload) => {
  const payload=req.body
  const user=await prisma.user.findUniqueOrThrow({
    where:{
      email:decodedToken.email
    },
    include:{
      patient:true
    }
  })
  if(!user.patient){
    throw new AppError(httpStatus.BAD_REQUEST,"User dosen't have patient profile")
  }

 const updatedPatient=await prisma.patient.update({
  where:{
    patientId:user.patient.patientId
  },
  data:payload
 })
 return updatedPatient
};

const softDelete = async () => {

};

export const DoctorService = {
   becomeDoctor,
    getAllFromDB,
    updateIntoDB,
    softDelete,
};