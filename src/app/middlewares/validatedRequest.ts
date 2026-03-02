import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validatedRequest=(zodObj:ZodObject)=>{
return async(req:Request,res:Response,next:NextFunction)=>{
    try{


   req.body=zodObj.parse(req.body)
    next()
 
    }
    catch(err){
      next(err)
    }
}
}
export default validatedRequest