import { Router } from 'express';
import { authRoutes } from '../../modules/auth/routes/auth.routes';
import productsRouter from '../../modules/product/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRouter);

export default router;
