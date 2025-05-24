import { Router } from 'express';
import { authRoutes } from '../../modules/auth/routes/auth.routes';
import productsRouter from '../../modules/product/routes';
import { trainerRoutes } from '../../modules/trainer/routes/trainer.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRouter);
router.use('/trainers', trainerRoutes);

export default router;
