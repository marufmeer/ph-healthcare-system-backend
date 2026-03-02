import  { Router } from 'express';


import { UserRole } from '@prisma/client';
import validatedRequest from '../../middlewares/validatedRequest';
import { upload } from '../../../config/multer.config';
import { checkAuth } from '../../middlewares/checkAuth';
import { CategoryController } from './category.controller';
import { CategoryCreateSchema } from './category.validation';


const router = Router();
router.get(
    '/',
   CategoryController.getAllFromDB
);

router.post(
    '/',
    checkAuth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
upload.single('file'),validatedRequest(CategoryCreateSchema),CategoryController.inserIntoDB
);


router.patch(
    '/:id',
    checkAuth(UserRole.ADMIN, UserRole.ADMIN),
    CategoryController.deleteFromDB
);

export const CategoryRoutes = router;