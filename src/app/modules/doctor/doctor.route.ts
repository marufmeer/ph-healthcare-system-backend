import { Router } from 'express';
import { DoctorController } from './doctor.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '@prisma/client';
import validatedRequest from '../../middlewares/validatedRequest';
import { BecomeDoctorSchema } from './doctor.validation';



const router = Router();
router.post("/become-doctor",checkAuth(UserRole.USER,UserRole.PATIENT,UserRole.ASSISTANT),validatedRequest(BecomeDoctorSchema),DoctorController.becomeDoctor)
router.get(
    '/',
    DoctorController.getAllFromDB
);

router.get(
    '/:id',
    DoctorController.getByIdFromDB
);

router.patch(
    '/update-doctor-profile',checkAuth(UserRole.DOCTOR),
    DoctorController.updateIntoDB
);

router.delete(
    '/:id',
    DoctorController.deleteFromDB
);
router.delete(
    '/soft/:id',
    DoctorController.softDelete
);

export const DoctorRoutes = router;