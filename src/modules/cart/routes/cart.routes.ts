import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../../auth/middlewares/authenticate';
import { requireAuth } from '../../auth/middlewares/requireAuth';

export const cartRoutes = Router();

cartRoutes.get('/', authenticate, requireAuth, CartController.getCart);
cartRoutes.delete('/', authenticate, CartController.clearCart);

cartRoutes.post('/items', authenticate, requireAuth, CartController.addItem);
cartRoutes.post('/items/batch', authenticate, requireAuth, CartController.addItems);
cartRoutes.patch('/items', authenticate, requireAuth, CartController.updateItem);
cartRoutes.delete('/items/:productId', authenticate, CartController.deleteCartItem);
