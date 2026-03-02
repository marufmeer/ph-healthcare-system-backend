import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status-codes';

import { PatientService } from './patient.service'; 
import { JwtPayload } from 'jsonwebtoken';

const becomePatient= catchAsync(async (req: Request, res: Response) => {

const result=await PatientService.becomePatient(req)
 sendResponse(res,{
  success:true,
  statusCode:httpStatus.CREATED,
  message:"Patient created successFully",
  data:result
 })
  
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
 

  
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

  
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
const decodedToken=req.user as JwtPayload
 const result=await PatientService.updateIntoDB(req,decodedToken)
 sendResponse(res,{
  success:true,
  statusCode:httpStatus.OK,
  message:"Patient profile updated successfully.",
  data:result
 })
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  
});


const softDelete = catchAsync(async (req: Request, res: Response) => {
 
});

export const PatientController = {
    becomePatient,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};