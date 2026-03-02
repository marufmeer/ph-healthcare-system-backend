import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { sendCookie } from "../../../shared/resCookie";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import { jwtHelper } from "../../helpers/jwtHelper";
import { envVars } from "../../../config";
import passport from "passport";
import { UserRole } from "@prisma/client";



const login = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  passport.authenticate("local",(err:any,user:any,info:any)=>{
 if(err){
 return next(new AppError(httpStatus.BAD_REQUEST,err))
 }
 if(!user){
        return next(new AppError(httpStatus.BAD_REQUEST, info.message))
 }
 const userPayload={
    id:user.userId,
    email:user.email,
    role:user.role,
    activeRole:user.activeRole
}
const {password,...restData}=user
  const accessToken = jwtHelper.generateToken(userPayload,envVars.JWT.JWT_SECRET_ACCESS_TOKEN,envVars.JWT.JWT_ACCESS_TOKEN_EXPIRES)

  const refreshToken =jwtHelper.generateToken(userPayload,envVars.JWT.JWT_SECRET_REFRESH_TOKEN,envVars.JWT.JWT_REFRESH_TOKEN_EXPIRES) 
   sendCookie(res,{
    accessToken,
    refreshToken
   })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
      user:restData
    },
  });
  })(req,res,next)


});

const googleCallBackController = catchAsync(async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? req.query.state as string : ""
        if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

 const user=req.user as JwtPayload
 if(!user)  {
  throw new AppError(httpStatus.NOT_FOUND,"User not found.")
 }
 const payload={
  id:user.userId ,
  email:user.email,
  role:user.role,
  activeRole:user.activeRole
} 
   const accessToken = jwtHelper.generateToken(payload,envVars.JWT.JWT_SECRET_ACCESS_TOKEN,envVars.JWT.JWT_ACCESS_TOKEN_EXPIRES)

  const refreshToken =jwtHelper.generateToken(payload,envVars.JWT.JWT_SECRET_REFRESH_TOKEN,envVars.JWT.JWT_REFRESH_TOKEN_EXPIRES)
  sendCookie(res,{
    accessToken,
    refreshToken
  })
     res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent to email",
    data:null
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
 const token=req.user as JwtPayload
  await AuthService.resetPassword(token,req.body);
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful",
    data:null
  });
});
const switchRole = catchAsync(async (req: Request, res: Response) => {
 const token=req.user as JwtPayload
  await AuthService.switchRole(token,req.body);
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role switch successfully.",
    data:null
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  await AuthService.changePassword(user as JwtPayload, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data:null
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
const refreshToken=req.headers?.authorization as string
  const result = await AuthService.refreshToken(refreshToken);
  sendCookie(res,result)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed",
    data: result,
  });
});
const setPassword = catchAsync(async (req: Request, res: Response) => {
const decodedToken=req.user as JwtPayload
await AuthService.setPassword(decodedToken,req.body)
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password set successfully.",
    data:null,
  });
});
const logOut = catchAsync(async (req: Request, res: Response) => {
 res.clearCookie("accessToken",{
  httpOnly:true,
  secure:false,
  sameSite:"none"
 })
 res.clearCookie("refreshToken",{
  httpOnly:true,
  secure:false,
  sameSite:"none"
 })
sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully.",
    data:null,
  });
});

export const AuthController = {
  login,
googleCallBackController,
  forgotPassword,
  resetPassword,
  switchRole,
  changePassword,
  refreshToken,
  setPassword,
  logOut
};
