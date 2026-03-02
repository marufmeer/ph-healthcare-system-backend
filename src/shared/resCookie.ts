import { Response } from "express";
import { envVars } from "../config";
export interface ITokens{
 accessToken?:string
 refreshToken?:string
}
export const sendCookie=(res:Response,result:ITokens)=>{
 if(result.accessToken){
    res.cookie("accessToken",result.accessToken,{
       httpOnly:true,
       secure:false
    })
 }
 if(result.refreshToken){
   res.cookie("refreshToken",result.refreshToken,{
      httpOnly:true,
       secure:false
    
    }) 
 }
}