import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { scheduleServices } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status-codes"

const scheduleGenerate=catchAsync(async (req: Request, res: Response)=>{
const result=scheduleServices.scheduleGenerate(req.body)
 sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Schedule create successfully.",
  data:result
 })
})
const scheduleUpdate=catchAsync(async (req: Request, res: Response)=>{

})
const scheduleDelete=catchAsync(async (req: Request, res: Response)=>{

})
export const scheduleControllers={
    scheduleGenerate,
    scheduleUpdate,
    scheduleDelete
}