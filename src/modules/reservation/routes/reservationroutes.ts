import { Router } from "express";
import { ReservationController } from "../controllers/orders.controller";

export const reservationRoutes = Router();

reservationRoutes.post('/create', ReservationController.createReservation)
reservationRoutes.post('/webhooks/mercadopago', ReservationController.receiveWebhook)