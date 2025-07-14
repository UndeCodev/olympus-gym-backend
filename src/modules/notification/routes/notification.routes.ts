import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";

export const notificationsRoutes = Router();

notificationsRoutes.post('/verify', NotificationController.getNotificationsByVerificationCode)

notificationsRoutes.get('/cart/:userId', NotificationController.getCart)
notificationsRoutes.post('/cart', NotificationController.addCartItem)