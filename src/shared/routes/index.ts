import { Router } from 'express';

import { requireAuth } from '../../modules/auth/middlewares/requireAuth';
import { authenticate } from '../../modules/auth/middlewares/authenticate';

import { authRoutes } from '../../modules/auth/routes/auth.routes';
import productsRouter from '../../modules/product/routes';
import { trainerRoutes } from '../../modules/trainer/routes/trainer.routes';
import { cartRoutes } from '../../modules/cart/routes/cart.routes';
import { notificationsRoutes } from '../../modules/notification/routes/notification.routes';
import { profileRoutes } from '../../modules/profile/routes/profile.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/product', productsRouter);
router.use('/cart', cartRoutes);
router.use('/trainer', trainerRoutes);
router.use('/notification', notificationsRoutes);
router.use('/profile', authenticate, requireAuth,profileRoutes);

export default router;
