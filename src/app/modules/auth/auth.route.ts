import {  NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "passport";
import { envVars } from "../../../config";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import validatedRequest from "../../middlewares/validatedRequest";
import { passwordUpdateSchema, switchRoleSchema } from "./auth.validate";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logOut",AuthController.logOut)
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password",checkAuth(...Object.values(UserRole)),AuthController.resetPassword);
router.patch("/switch-role",checkAuth(UserRole.USER,UserRole.PATIENT,UserRole.ASSISTANT,UserRole.DOCTOR),validatedRequest(switchRoleSchema),AuthController.switchRole);
router.post(
  "/change-password",
 checkAuth(...Object.values(UserRole)),
 validatedRequest(passwordUpdateSchema),
  AuthController.changePassword
);
router.post(
  "/set-password",
checkAuth(...Object.values(UserRole)),
  AuthController.setPassword
);

router.post("/refresh-token", AuthController.refreshToken);

router.get("/google/login",async(req:Request,res:Response,next:NextFunction)=>{
const redirect = req.query.redirect || "/"
  passport.authenticate("google",{scope:["profile","email"],state:redirect as string})(req,res,next)
})
router.get("/google/callback",(req,res,next)=>{
  passport.authenticate("google",{
    session:false
  },
  (err,user,info)=>{
    if(err){
      return next(err)
    }
      if (!user) {
        return res.redirect(
          `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with our support team!`
        );
      }
      req.user=user 
      AuthController.googleCallBackController(req,res,next)
  }
)(req,res,next)
}) 


export const AuthRoutes = router;
