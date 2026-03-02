import { Router } from 'express';
import { PatientController } from './patient.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '@prisma/client';
import validatedRequest from '../../middlewares/validatedRequest';
import { BecomePatientSchema, UpdatePatientSchema } from './patient.validate';


const router = Router();
router.post("/become-patient",checkAuth(UserRole.USER,UserRole.DOCTOR,UserRole.ASSISTANT),validatedRequest(BecomePatientSchema),PatientController.becomePatient)
router.get(
    '/',
    PatientController.getAllFromDB
);

router.get(
    '/:id',
    PatientController.getByIdFromDB
);

router.patch(
    '/update-patient-profile',checkAuth(UserRole.PATIENT),validatedRequest(UpdatePatientSchema),
    PatientController.updateIntoDB
);

router.delete(
    '/:id',
    PatientController.deleteFromDB
);
router.delete(
    '/soft/:id',
    PatientController.softDelete
);

export const PatientRoutes = router;