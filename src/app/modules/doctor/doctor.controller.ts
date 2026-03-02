import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status-codes';

import { DoctorService } from './doctor.service';
import { JwtPayload } from 'jsonwebtoken';
import pick from '../../helpers/pick';
import { doctorFilterableFields, doctorOptionsFields } from './doctor.constant';

const becomeDoctor= catchAsync(async (req: Request, res: Response) => {

const result=await  DoctorService.becomeDoctor(req)
 sendResponse(res,{
  success:true,
  statusCode:httpStatus.CREATED,
  message:"Patient created successFully",
  data:result
 })
  
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {

  const result = await DoctorService.getAllFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully!",
  data: result,
  });
  
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

  
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
const decodedToken=req.user as JwtPayload
 const result=await  DoctorService.updateIntoDB(req,decodedToken)
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

export const DoctorController = {
    becomeDoctor,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};