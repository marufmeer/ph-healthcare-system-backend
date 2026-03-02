import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { handleZodError } from "../errorhelpers/zodError";
import z from "zod";
import { TErrorSources } from "../interfaces/error.type";


const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
       let statusCode=httpStatus.INTERNAL_SERVER_ERROR
        let message=err.message || "Something went wrong"
        let success=false
        let error=err
        let errorSources:TErrorSources[]=[]
        if(err instanceof z.ZodError){
          const simplifiedError=handleZodError(err)
          message=simplifiedError.message
         statusCode=simplifiedError.status,
    errorSources=simplifiedError.errorSources
         
        }
        if(err instanceof PrismaClientKnownRequestError){
           if(err.code==="P2002"){
            message="Duplicate key error."
            error=err.meta,
            statusCode=httpStatus.CONFLICT
           }
           if(err.code==="P100)"){
            message="Authentication failed against database server."
            error=err.meta,
            statusCode=httpStatus.BAD_GATEWAY
           }
           if(err.code==="P2003"){
            message="Foreign key constraint failed."
            error=err.meta,
            statusCode=httpStatus.BAD_REQUEST
           }
        }
      else if(err instanceof PrismaClientValidationError){
            message="Prisma validation error",
            error=err.message,
            statusCode=httpStatus.BAD_REQUEST
        }
            else if (err instanceof PrismaClientUnknownRequestError) {
        message = "Unknown Prisma error occured!",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
    else if (err instanceof PrismaClientInitializationError) {
        message = "Prisma client failed to initialize!",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
        res.status(statusCode).json({
            success,
            message,
            errorSources,
            error
            
        })
}
export default globalErrorHandler