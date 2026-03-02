import { NextFunction, Request, Response } from "express"
import { AppError } from "../errors/appError"
import httpStatus from "http-status-codes"
import { jwtHelper } from "../helpers/jwtHelper"
import { envVars } from "../../config"
import { prisma } from "../../shared/prisma"
import { UserStatus } from "@prisma/client"
import { role_profile_map } from "../interfaces/roleSupport"


export const checkAuth=(...authRoles:string[])=>{
return async(req:Request,res:Response,next:NextFunction)=>{
    try{
const token=req.headers?.authorization
  if(!token){
    throw new AppError(httpStatus.NOT_FOUND,"Token not found.")
  } 
 const verifiedToken=jwtHelper.verifyToken(token,envVars.JWT.JWT_SECRET_ACCESS_TOKEN)
 if(!verifiedToken){
      throw new AppError(httpStatus.BAD_REQUEST,"Token can't verify.")
 }
const user=await prisma.user.findUniqueOrThrow({
    where:{
        email:verifiedToken.email
    },
    include:{
      role:true,
      patient:true,
      admin:true,
      assistant:true,
      doctor:true
    }
})

if(user.status==UserStatus.BLOCKED||user.status==UserStatus.DELETED){
    throw new AppError(httpStatus.BAD_REQUEST,`User is ${user.status}. `)
}
if(!user.isVerified){
    throw new AppError(httpStatus.BAD_REQUEST,"User isn't verified. ")
}
 for(const role of user.role){
  const profileKey=role_profile_map[role.name]
  if(profileKey && !user[profileKey as keyof typeof user]){
 throw new AppError(
            httpStatus.FORBIDDEN,
            `User has ${role.name} role but ${profileKey} profile does not exist.`
          );
  }
 }
const hasRole=user.role?.some(r=>authRoles.includes(r.name))
 if(!hasRole){
  throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to access this route.");
 }
 
 req.user=verifiedToken
 next()
    }
  catch(error){
          console.log("jwt error", error);
        next(error)
  }
}
}