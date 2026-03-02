import { v2 as cloudinary } from "cloudinary"
import { envVars } from "."
import { AppError } from "../app/errors/appError"
import httpStatus from "http-status-codes"
cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
    api_key: envVars.CLOUDINARY.API_KEY,
    api_secret: envVars.CLOUDINARY.API_SECRET
})
export const deleteImageFromCloudinary=async(url:string)=>{
    try{
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
const match = url.match(regex);
if(match&&match[1]){
const  public_id=match[1]
   await cloudinary.uploader.destroy(public_id) 
     console.log(`File ${public_id} is deleted from cloudinary`);
}
     
    }
     catch(error:any){
          throw new AppError(httpStatus.BAD_REQUEST, "Cloudinary image deletion failed", error.message)
     }
}
export const cloudinaryUpload=cloudinary
