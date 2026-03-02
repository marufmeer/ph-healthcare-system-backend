import { Patient, Prisma, UserRole, UserStatus } from '@prisma/client';
import { paginationHelper } from '../../helpers/paginationHelper'; 
import { prisma } from '../../../shared/prisma';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../../errors/appError';
import httpStatus from "http-status-codes"

const becomePatient = async (
req:Request
) => {
const decodedToken=req.user as JwtPayload 
const payload=req.body 
const user=await prisma.user.findUniqueOrThrow({
  where:{
    email:decodedToken.email
  },
  include:{
    patient:true
  }
 
})
 if(user.patient){
  throw new AppError(httpStatus.BAD_REQUEST,"User is already a patient.")
 } 
  const patient = await prisma.$transaction(async (tx) => {
    const newPatient = await tx.patient.create({
      data: {
        ...payload,
        userId: user.userId,
      },
    });
   await tx.role.create({
    data:{
     userId:user.userId,
     name:UserRole.PATIENT
    }
   })
    await tx.user.update({
      where: { userId: user.userId },
      data: {
        activeRole:UserRole.PATIENT,
      },
    });

    return newPatient;
  });
  return patient
};
const getAllFromDB = async (

) => {

};

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

export const PatientService = {
   becomePatient,
    getAllFromDB,

  updateIntoDB,

  softDelete,
};