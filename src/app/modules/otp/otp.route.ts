import { Router } from "express";
import { OTPController } from "./otp.controller";

const router = Router();

router.post("/send-otp", OTPController.sendOTP);
router.post("/verify-otp", OTPController.verifyOTP);

export const OTPRoutes = router;