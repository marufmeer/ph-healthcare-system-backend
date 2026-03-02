
import { AuthProviderType, UserRole } from "@prisma/client"
import { envVars } from "../../config"
import { prisma } from "../../shared/prisma"
import { passwordHash } from "../../shared/hashedPassword"

export const seedSuperAdmin=async()=>{
const adminExists=await prisma.user.findUnique({
    where:{
        email:envVars.ADMIN.SUPER_ADMIN_EMAIL
    }
})
if(adminExists){
 console.log("Super Admin already exists.")
 return;
}
  const hashedPassword = await passwordHash(envVars.ADMIN.SUPER_ADMIN_PASS);
const payload={
    name:envVars.ADMIN.SUPER_ADMIN_NAME,
    email:envVars.ADMIN.SUPER_ADMIN_EMAIL,
    password:hashedPassword,
    isVerified:true,
    activeRole:UserRole.SUPER_ADMIN,
    needPasswordChange:true
}
  await prisma.$transaction(async(tnx)=>{
    const user=await tnx.user.create({
        data:payload
    })
   await tnx.role.create({
        data:{
            userId:user.userId,
            name:UserRole.SUPER_ADMIN
        }
    })
    await tnx.authProvider.create({
        data:{
            userId:user.userId,
            provider:AuthProviderType.CREDENTIALS
        }
    })
    await tnx.admin.create({
        data:{
            userId:user.userId,
        }
    })
  })
  console.log("Super Admin seeded successfully.");
}