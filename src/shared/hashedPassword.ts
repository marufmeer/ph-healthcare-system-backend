import bcrypt from "bcrypt"
import { envVars } from "../config"
export const passwordHash=async(password:string)=>{
 const hashedPassword=await bcrypt.hash(password,Number(envVars.BCRYPT_SALT_ROUND))
 return hashedPassword
}