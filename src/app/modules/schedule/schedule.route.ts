import { Router } from "express";
import { scheduleControllers } from "./schedule.controller";
import validatedRequest from "../../middlewares/validatedRequest";
import { scheduleGenerateSchema } from "./schedule.validate";


const router=Router()
router.post("/schedule-generate",validatedRequest(scheduleGenerateSchema),scheduleControllers.scheduleGenerate)
router.patch("/schedule-update",scheduleControllers.scheduleGenerate)
router.delete("/:id",scheduleControllers.scheduleGenerate)

export const scheduleRoutes=router