import { Router } from 'express';

import { requireAuth } from '../../modules/auth/middlewares/requireAuth';
import { authenticate } from '../../modules/auth/middlewares/authenticate';

import { authRoutes } from '../../modules/auth/routes/auth.routes';
import productsRouter from '../../modules/product/routes';
import { trainerRoutes } from '../../modules/trainer/routes/trainer.routes';
import { cartRoutes } from '../../modules/cart/routes/cart.routes';
import { notificationsRoutes } from '../../modules/notification/routes/notification.routes';
import { profileRoutes } from '../../modules/profile/routes/profile.routes';
import { companyInfoRoutes } from '../../modules/company_info/routes/company_info.routes';
import { muscleGroupRoutes } from '../../modules/muscle_group/routes/muscle_group.routes';
import { difficultyLevelRoutes } from '../../modules/difficulty_level/routes/difficulty_level.routes';
import { exerciseRoutes } from '../../modules/exercise/routes/exercise.routes';
import masterRoutinesRoutes from '../../modules/master_routines/routes/master_routines.routes';
import userRoutinesRoutes from '../../modules/user_routines/routes/user_routine.routes';
import exerciseLogRoutes from '../../modules/exercise_logs/routes/exercise_log.routes';
import myRoutineRoutes from '../../modules/my_routine/routes/my_routine.routes';
import membershipPlansRoutes from '../../modules/membership_plans/routes/membership_plans.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/product', productsRouter);
router.use('/cart', cartRoutes);
router.use('/trainer', trainerRoutes);
router.use('/notification', notificationsRoutes);
router.use('/profile', authenticate, requireAuth, profileRoutes);
router.use('/company-info', companyInfoRoutes);
router.use('/muscle-group', authenticate, requireAuth, muscleGroupRoutes);
router.use('/master-routine', authenticate, requireAuth, masterRoutinesRoutes);
router.use('/difficulty-level', authenticate, requireAuth, difficultyLevelRoutes);
router.use('/exercise', authenticate, requireAuth, exerciseRoutes);
router.use('/user-routines', authenticate, requireAuth, userRoutinesRoutes);
router.use('/exercise-logs', authenticate, requireAuth, exerciseLogRoutes);
router.use('/my-routine', authenticate, requireAuth, myRoutineRoutes);
router.use('/membership-plans', authenticate, requireAuth, membershipPlansRoutes);

export default router;
