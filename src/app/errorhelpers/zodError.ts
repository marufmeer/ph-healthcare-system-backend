import { TErrorSources } from "../interfaces/error.type"
import httpStatus from "http-status-codes"
export const handleZodError=(err:any)=>{
      const errorSources:TErrorSources[]=[]
  
      err?.issues?.forEach((issue:any)=>{
        errorSources.push({
    message:issue.message,
        path:issue.path
        })
      })
      return{
        status:httpStatus.BAD_REQUEST,
        message:"Zod Error",
        errorSources
      }
}