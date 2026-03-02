import crypto from "crypto"
 const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

    return otp
}
 const hashOtp = (otp: string): string => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

export const otpCustomize={
    generateOtp,
    hashOtp
}