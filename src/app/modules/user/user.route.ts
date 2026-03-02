import { Router } from "express";
import { UserController } from "./user.controller";
import validatedRequest from "../../middlewares/validatedRequest";
import { AdminSchema, AssistantSchema, DoctorSchema, PatientSchema, updateProfileSchema, updateStatus, UserSchema } from "./user.validator";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../config/multer.config";

const router = Router();
router.get("/",checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN) ,UserController.getAllFromDB);
router.get("/me",checkAuth(...Object.values(UserRole)), UserController.getMyProfile);
router.post("/register-user",validatedRequest(UserSchema), UserController.registerUser);
router.post("/create-user",checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validatedRequest(UserSchema), UserController.createUser);
router.post("/create-patient",checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validatedRequest(PatientSchema), UserController.createPatient);
router.post("/create-admin",checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validatedRequest(AdminSchema), UserController.createAdmin);
router.post("/create-doctor",validatedRequest(DoctorSchema), UserController.createDoctor);
router.post("/create-assistant",checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validatedRequest(AssistantSchema), UserController.createAssistant);
router.patch("/update-profile",checkAuth(...Object.values(UserRole)),upload.single("file"),validatedRequest(updateProfileSchema),UserController.updateProfile);
router.patch("/:id/status",checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validatedRequest(updateStatus),UserController.changeProfileStatus);
router.get("/:id",checkAuth(...Object.values(UserRole)),UserController.getSingleUserFromDB)

export const UserRoutes = router;
