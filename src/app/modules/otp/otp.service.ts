import { redisclient } from "../../../config/redis.config";
import { otpCustomize } from "../../../shared/otpCustomize";
import { prisma } from "../../../shared/prisma";
import { sendEmail } from "../../../shared/sendEmail";
import { AppError } from "../../errors/appError";
import httpStatus from "http-status-codes";

const OTP_EXPIRY = 2*60;
const sendOTP = async (email:string) => {
    const user=await prisma.user.findUniqueOrThrow({
        where:{
            email:email
        }
    })
    if (user.isVerified){
     throw new AppError(httpStatus.BAD_REQUEST,"User already verified");   
    } 

  const redisKey=`otp:${email}`
  const existingOtp=await redisclient.get(redisKey)
    if (existingOtp) {
    return { success: false, message: "Please wait 120 seconds before requesting a new OTP." };
  }
  const otp = otpCustomize.generateOtp();
  const hashedOtp=otpCustomize.hashOtp(otp)
 

  await redisclient.set(redisKey, hashedOtp, {
    expiration: { type: "EX", value: OTP_EXPIRY }
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "email-verification",
    templateData: { name: user.name, otp, }
  });
return { success: true, message: "OTP sent successfully." };
};

const verifyOTP = async (email: string, otp: string) => {
    const MAX_VERIFY_ATTEMPTS = 10
     const redisKey=`otp:${email}`
     const redisAttemptKey=`otp-attempt:${email}`
  const savedOTP = await redisclient.get(redisKey);
  const hashOtp=otpCustomize.hashOtp(otp)
  
  if (!savedOTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired or not found");
  }
 const attempts = await redisclient.get(redisAttemptKey) ;
  const attemptNum = attempts ? parseInt(attempts) : 0;
  if(attemptNum>MAX_VERIFY_ATTEMPTS){
    return { success: false, message: "Maximum OTP verification attempts reached. Please request a new OTP." };
  }
  if (savedOTP !== hashOtp) {
   await redisclient.set(redisAttemptKey,(attemptNum+1).toString(),{
    expiration:{
        type:"EX",
        value:60*5
    }
   })
    return { success: false, message: `Invalid OTP. You have ${MAX_VERIFY_ATTEMPTS - (attemptNum + 1)} attempts left.` };
  }

  await prisma.user.update({
    where:{
        email:email
    },
    data:{
        isVerified:true
    }
  })
  await redisclient.del(redisKey);
  await redisclient.del(redisAttemptKey);

 
  return { success: true, message: "OTP verified successfully." };
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
