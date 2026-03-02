import  { Router } from 'express';


import { UserRole } from '@prisma/client';

import validatedRequest from '../../middlewares/validatedRequest';
import { SpecializationValidtaion } from './specialization.validation';

import { SpecializationController } from './specialization.controller';
import { checkAuth } from '../../middlewares/checkAuth';


const router = Router();
router.get(
    '/',
   SpecializationController.getAllFromDB
);

router.post(  '/',checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),validatedRequest(SpecializationValidtaion.create),SpecializationController.inserIntoDB
);


router.delete(
    '/:id',
    checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    SpecializationController.deleteFromDB
);

export const SpecializationRoutes = router;