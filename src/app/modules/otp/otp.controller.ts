import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse"; 
import { OTPService } from "./otp.service";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body; // email or phone

  const result=await OTPService.sendOTP(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data:null
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const result=await OTPService.verifyOTP(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data:null
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};
