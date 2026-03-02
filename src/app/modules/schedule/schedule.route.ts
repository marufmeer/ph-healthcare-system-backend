import { Router } from "express";
import { scheduleControllers } from "./schedule.controller";


const router=Router()
router.post("/schedule-generate",scheduleControllers.scheduleGenerate)
router.patch("/schedule-update",scheduleControllers.scheduleGenerate)
router.delete("/:id",scheduleControllers.scheduleGenerate)

export const scheduleRoutes=router