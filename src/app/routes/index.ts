
import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OTPRoutes } from "../modules/otp/otp.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { SpecializationRoutes } from "../modules/specialization/specialization.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";

const router=Router()
const moduleRoutes=[
    {
        path:"/user",
        route:UserRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
    {
        path:"/otp",
        route:OTPRoutes
    },
    {
        path:"/patient",
        route:PatientRoutes
    },
    {
    path:"/doctor",
    route:DoctorRoutes
    },
    {
        path:"/specialization",
        route:SpecializationRoutes
    },
    {
        path:"/category",
        route:CategoryRoutes
    },
    {
        path:"schedule",
        route:scheduleRoutes
    }
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))
export default router