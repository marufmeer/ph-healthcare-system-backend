import { prisma } from "../../../shared/prisma";
import bcrypt from "bcrypt";
import  { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import httpStatus from "http-status-codes";
import { jwtHelper } from "../../helpers/jwtHelper";
import { envVars } from "../../../config";
import { AuthProviderType, UserRole, UserStatus } from "@prisma/client";
import { sendEmail } from "../../../shared/sendEmail";
import { roleSwitchRules } from "../../interfaces/roleSupport";









const forgotPassword = async (payload:{
  email:string
}) => {
 const user=await prisma.user.findFirstOrThrow({
  where:{
    email:payload.email,
    status:UserStatus.ACTIVE,
    isVerified:true
  },
  include:{
    role:{
      select:{
        name:true
      }
    }
  }
 })
 const jwtPayload={
  id:user.userId,
  email:user.email,
  role:user.role,
  activeRole:user.activeRole,
  tokenVersion:user.tokenVersion
 }
 const resetToken=jwtHelper.generateToken(jwtPayload,envVars.JWT.JWT_SECRET_ACCESS_TOKEN,envVars.JWT.JWT_RESET_PASSWORD_EXPIRES)
    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user.userId}&token=${resetToken}`
    await sendEmail({
      to:user.email,
      subject:"Forgot Password",
      templateName:"forgot-password",
      templateData:{
        resetUiLink:resetUILink,
        email:user.email
      }

    })
};
 
  const resetPassword= async (
  token:JwtPayload,
  payload: { id:string,newPassword:string }
) => {
      if (payload.id !=token.id) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not reset your password")
    }
  
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: { userId: token.id},
  });
  if(token.tokenVersion!==existingUser.tokenVersion){
         throw new AppError(httpStatus.BAD_REQUEST,"Token is expired")
    }
  const hashedPassword = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  await prisma.user.update({
    where: { userId: existingUser.userId },
    data: { 
      password: hashedPassword,
      needPasswordChange:false,
      tokenVersion:{increment:1}
     },
  });
};
   
const switchRole= async (
  token:JwtPayload,
  payload: {activeRole:UserRole}
) => {
   const existingUser=await prisma.user.findUniqueOrThrow({
    where:{
      email:token.email
    },
    include:{
      role:true
    }
   })
   
 const roles=existingUser.role.map(r=>r.name)
   if (!roles.includes(payload.activeRole)) {
    throw new AppError(httpStatus.BAD_REQUEST, `User does not have role ${payload.activeRole}`);
  }
 if(!roleSwitchRules[existingUser.activeRole].includes(payload.activeRole)){
     throw new AppError(httpStatus.BAD_REQUEST,`User can't role change ${existingUser.activeRole} to ${payload.activeRole}`)
 }
   if (payload.activeRole === existingUser.activeRole) {
    return existingUser;
  }
const updatedUser=await prisma.user.update({
  where:{
    email:token.email
  },
  data:{
    activeRole:payload.activeRole
  }
 })
 
 return updatedUser
};
   

const changePassword = async (
  token:JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: { userId: token.id},
  });

  const isMatched = await bcrypt.compare(
    payload.oldPassword,
    existingUser.password as string
  );

  if (!isMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password incorrect");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: { userId: existingUser.userId },
    data: { password: hashedPassword,needPasswordChange:false },
  });
};

const refreshToken = async (token: string) =>
{
    let decodedData;
    try{
      console.log(token)
  decodedData = jwtHelper.verifyToken(token,envVars.JWT.JWT_SECRET_REFRESH_TOKEN)     
    }
      catch(error){
        throw new AppError(httpStatus.BAD_REQUEST,"You are not authorized!")
      }

const userData=await prisma.user.findUniqueOrThrow({
    where:{
        userId:decodedData.id,
        isVerified:true,
        status:UserStatus.ACTIVE
    },
    include:{
    role:{
      select:{
        name:true
      }
    }
  }
})
const payload={
    id:userData.userId,
        email:userData.email,
    role:userData.role,
    activeRole:userData.activeRole
}
    const accessToken = jwtHelper.generateToken(payload,envVars.JWT.JWT_SECRET_ACCESS_TOKEN,envVars.JWT.JWT_ACCESS_TOKEN_EXPIRES)

  const refreshToken =jwtHelper.generateToken(payload,envVars.JWT.JWT_SECRET_REFRESH_TOKEN,envVars.JWT.JWT_REFRESH_TOKEN_EXPIRES)

  return { accessToken,refreshToken };
};
const setPassword = async (decodedToken: JwtPayload,payload:{
  password:string
}) => { 
const user=await prisma.user.findUnique({
  where:{
    email:decodedToken.email
  }
})
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "User password already exists");
  }
 const hashedPassword=await bcrypt.hash(payload.password,Number(envVars.BCRYPT_SALT_ROUND))
await prisma.$transaction(async(tnx)=>{
  await tnx.user.update({
    where:{
      userId:user.userId
    },
    data:{
      password:hashedPassword
    }
  })
  await tnx.authProvider.create({
    data:{
      userId:user.userId,
      provider:AuthProviderType.CREDENTIALS
    }
  })
})

};

export const AuthService = {

  forgotPassword,
  resetPassword,
  switchRole,
  changePassword,
  refreshToken,
  setPassword
};
