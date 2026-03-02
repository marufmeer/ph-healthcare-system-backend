import {  AuthProviderType, Prisma, Status, User, UserRole } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { Request } from "express";
import { passwordHash } from "../../../shared/hashedPassword";
import { JwtPayload } from "jsonwebtoken";
import { userSearchableFields } from "./user.constant";
import { AppError } from "../../errors/appError";
import httpStatus from "http-status-codes"
import { paginationHelper } from "../../helpers/paginationHelper";
import { deleteImageFromCloudinary } from "../../../config/cloudinary.config";
import { generateUUIDRegistration } from "../../helpers/generateRegNum";
/* ================= Register User================= */
/* ================= REGISTER USER ================= */
const registerUser = async (req: Request) => {
  const payload = req.body;

 
   const exisitingUser=await prisma.user.findUnique({
    where:{email:payload.email}
   })
   if(exisitingUser){
     if(exisitingUser.isVerified){
        throw new AppError(httpStatus.BAD_REQUEST,"User already registered.")
     }
     else{
            throw new AppError(httpStatus.BAD_REQUEST,"User is not verified.")
     }
   }
     const hashedPassword = await passwordHash(payload.password);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        isVerified: false
      },
      select:{
        userId:true,
        name:true,
        email:true,
        password:false,
        profilePhoto:true,
        status:true,
        isVerified:true
      }
    });
    const role = await tx.role.create({
  data: {
    userId: user.userId,        
    name: UserRole.USER,     
  },
});  
    const authProvider = await tx.authProvider.create({
      data: {
        provider: AuthProviderType.CREDENTIALS,
        userId: user.userId,
      },
    });

    return {
      user,
     role, 
      authProvider,
    };
  });
};
const createUser = async (req: Request) => {
  const payload = req.body;
     const exisitingUser=await prisma.user.findUnique({
    where:{email:payload.email}
   })
   if(exisitingUser){
     throw new AppError(httpStatus.BAD_REQUEST,"User already created.")
   }
  const hashedPassword = await passwordHash(payload.password);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        isVerified: true,
        needPasswordChange:true
      },
      select:{
        userId:true,
        name:true,
        email:true,
        password:false,
        profilePhoto:true,
        status:true,
        isVerified:true
      }
    });
    const role = await tx.role.create({
  data: {
    userId: user.userId,        
    name: UserRole.USER,     
  },
});  
    const authProvider = await tx.authProvider.create({
      data: {
        provider: AuthProviderType.CREDENTIALS,
        userId: user.userId,
      },
    });

    return {
      user,
     role, 
      authProvider,
    };
  });
};

/* ================= CREATE PATIENT ================= */

export const createPatient = async (req:Request) => {
 const payload=req.body
const hashedPassword= await passwordHash(payload.password)
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name:payload.name,
        email: payload.email,
        password:hashedPassword,
        needPasswordChange:true,
        activeRole:UserRole.PATIENT
      },
    });
        const role = await tx.role.create({
  data: {
    userId: user.userId,        
    name: UserRole.PATIENT,     
  },
});  
   const authProvider=await tx.authProvider.create({
    data:{
      provider:AuthProviderType.CREDENTIALS,
      userId:user.userId
    }
   })
    const patient = await tx.patient.create({
      data: {
        ...payload.patient,
        userId: user.userId,
      },
    });

    return { user,role, patient,authProvider };
  });
};

/* ================= CREATE ADMIN ================= */
export const createAdmin = async (req:Request) => {
     const payload=req.body
     if(!payload.phoneNumber){
      throw new AppError(httpStatus.BAD_REQUEST,"Phone number is required.")
     }
const  hashedPassword= await passwordHash(payload.password)
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name:payload.name,
        email: payload.email,
        password: hashedPassword,
        phoneNumber:payload.phoneNumber,
        needPasswordChange:true,
        activeRole:UserRole.ADMIN
      },
    });
     const role = await tx.role.create({
  data: {
    userId: user.userId,        
    name: UserRole.ADMIN,     
  },
});  
     const authProvider=await tx.authProvider.create({
    data:{
      provider:AuthProviderType.CREDENTIALS,
      userId:user.userId
    }
   })
    const admin = await tx.admin.create({
      data: {
        userId: user.userId,
      },
    });

    return { user,role, admin,authProvider };
  });
};

/* ================= CREATE DOCTOR ================= */
export const createDoctor = async (req:Request) => {
    const payload=req.body
   
    const {specializationIds,...restData}=payload.doctor
const  hashedPassword= await passwordHash(payload.password)
 const registrationNumber=generateUUIDRegistration("DOC")
return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name:payload.name,
        email: payload.email,
        password: hashedPassword,
        needPasswordChange:true,
        activeRole:UserRole.DOCTOR
      },
    });
     const role = await tx.role.create({
  data: {
    userId: user.userId,        
    name: UserRole.DOCTOR,     
  },
});  
  const authProvider=await tx.authProvider.create({
    data:{
      provider:AuthProviderType.CREDENTIALS,
      userId:user.userId
    }
   })
    const doctor = await tx.doctor.create({
      data: {
        ...restData,
        averageRating: 0,
        userId: user.userId,
        status:Status.APPROVED,
        registrationNumber:registrationNumber
      },
    });
   const assignSpecialization=await tx.doctorSpecialization.createMany({
    data:specializationIds.map((specialize:string)=>({
      doctorId:doctor.doctorId,
      specializationId:specialize
     })
    
    ),
    skipDuplicates:true
   })
    return { user,role, doctor,authProvider,assignSpecialization };
  });
};

/* ================= CREATE ASSISTANT ================= */
export const createAssistant = async (req:Request) => {
   const payload=req.body
   const {specializationIds,...restData}=payload.assistant
const  hashedPassword= await passwordHash(payload.password)
 const registrationNumber=generateUUIDRegistration("AST")   
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name:payload.name,
        email: payload.email,
        password: hashedPassword,
        needPasswordChange:true,
        activeRole:UserRole.ASSISTANT
      },
    });
     const role = await tx.role.create({
  data: {
    userId: user.userId,        
    name: UserRole.ASSISTANT,     
  },
});  
   const authProvider=await tx.authProvider.create({
    data:{
      provider:AuthProviderType.CREDENTIALS,
      userId:user.userId
    }
   })
    const assistant = await tx.assistant.create({
      data: {
        ...restData,
        averageRating: 0,
        userId: user.userId,
        status:Status.APPROVED,
        registrationNumber:registrationNumber
      },
    });
  const assignSpecialization=await tx.assistantSpecialization.createMany({
    data:specializationIds.map((specialize:string)=>({
      assistantId:assistant.assistantId,
      specializationId:specialize
     })
    
    ),
    skipDuplicates:true
   })
    return { user,role, assistant,authProvider,assignSpecialization };
  });
};



const getAllFromDB = async (params:any,options:Record<string,unknown>) => {
  const {searchTerm,...filter}=params
  const {page,limit,skip,sortBy,sortOrder}=paginationHelper(options)
    const andConditions:Prisma.UserWhereInput[]=[]
   if (searchTerm) {
    andConditions.push({
      OR:userSearchableFields.map(field => ({
    [field]: {
      contains: searchTerm,
      mode: "insensitive",
    },
  })),  
    })

   }
    if(Object.keys(filter).length>0){
     andConditions.push({
      AND:Object.keys(filter).map(key=>({
     [key]:{
      equals:filter[key]
     }
      }))
     }) 
    }  
    const whereConditions:Prisma.UserWhereInput=andConditions.length>0?{
      AND:andConditions
    }:{}
  const user=await prisma.user.findMany({
    where:whereConditions,
    skip:skip,
    take:limit,
    orderBy:{
      [sortBy]:sortOrder
    },
    include:{
      role:true,
      authProvider:true,
    }
  })
  let userResult=[]
  for(const userData of user){
    const {password,...restData}=userData
    userResult.push(restData)
  }
  const total=await prisma.user.count({
    where:whereConditions
  })
  return {
    meta:{
      page,
      limit,
      total
    },
    userResult
  }
}
const getSingleUserFromDB=async(id:string)=>{
const user=await prisma.user.findUniqueOrThrow({
  where:{
    userId:id
  },
  include:{
    doctor:true,
    patient:true,
    admin:true
  },
  
})
return user
}
const getMyProfile = async (token:JwtPayload) => {
const user=await prisma.user.findUniqueOrThrow({
  where:{
    email:token.email
  },
  include:{
    role:true
  }
})
const role=user.role.map(r=>r.name)
let profileData={}
if(role.includes(UserRole.PATIENT)){
profileData=await prisma.patient.findUniqueOrThrow({
  where:{
    userId:user.userId
  }
 })
}
if(role.includes(UserRole.ASSISTANT)){
profileData=await prisma.assistant.findUniqueOrThrow({
  where:{
    userId:user.userId
  }
 })
}
if(role.includes(UserRole.DOCTOR)){
profileData=await prisma.doctor.findUniqueOrThrow({
  where:{
    userId:user.userId
  }
 })
}
if(role.includes(UserRole.ADMIN)){
profileData=await prisma.admin.findUniqueOrThrow({
  where:{
    userId:user.userId
  }
 })
}
if(role.includes(UserRole.SUPER_ADMIN)){
profileData=await prisma.admin.findUniqueOrThrow({
  where:{
    userId:user.userId
  }
 })
}
const {password,...userData}=user
return {userData,profileData}
}
const updateProfile=async(req:Request)=>{
 const decodedToken=req.user as JwtPayload
 const payload=req.body
 const imageUrl=req.file?.path
 const exisitingUser=await prisma.user.findUniqueOrThrow({
  where:{
    email:decodedToken.email
  }
 })
 let profilePhoto:string|null=exisitingUser.profilePhoto
  if(imageUrl){
    if(exisitingUser.profilePhoto){
      await deleteImageFromCloudinary(exisitingUser.profilePhoto)
    }
   profilePhoto=imageUrl
  }
const updatedUser=await prisma.user.update({
  where:{
   email:decodedToken.email
  },
  data:{
    ...payload,
    profilePhoto
  }
})
return {updatedUser}
}
const changeProfileStatus = async (id:string,data:any) => {
 const user= await prisma.user.findUniqueOrThrow({
  where:{
    userId:id
  }
 })
 const updatedUserStatus=await prisma.user.update({
  where:{
    userId:user.userId
  },
  data:{
    status:data
  }
 })
 return updatedUserStatus
};

export const UserService = {
  registerUser,
  createUser,
    createPatient,
    createAdmin,
    createDoctor,
    createAssistant,
    getAllFromDB,
    getSingleUserFromDB,
    getMyProfile,
    updateProfile,
    changeProfileStatus
}