import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { paymentClient } from '../../../shared/lib/mercadoPago';
import { generatePickupCode } from '../../../shared/utils/pickup-code-generator';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processWebhookService = async (webhookData: any) => {
  // Basic webhook validation
  const type = webhookData.type || webhookData.topic || webhookData.action?.split('.')[0];
  if (type !== 'payment') return { status: 'ignored', type };

  // Get payment id
  const paymentId = webhookData.data?.id || webhookData.resource;
  if (!paymentId) throw new AppError({ httpCode: HttpCode.BAD_REQUEST, description: 'Payment id not found' });

  // Get payment details
  const payment = await paymentClient.get({ id: paymentId });

  // Check if payment is duplicated
  const existingReservation = await prisma.reservation.findUnique({
    where: { mercadoPagoReferenceId: String(payment.collector_id) },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
        },
      },
    },
  });

  if (existingReservation && existingReservation.status === 'PAID') {
    return { paymentId, status: 'duplicated', processed: false };
  }

  console.log({ existingReservation });

  // Check payment status
  if (payment.status !== 'approved') return { paymentId, status: payment.status, processed: false };

  const { metadata } = payment;
  const reservationId = metadata.reservation_id;

  await prisma.$transaction(async (tx) => {
    // A. Actualizar reserva
    const reservationUpdated = await tx.reservation.update({
      where: { id: existingReservation!.id },
      data: {
        status: 'PAID',
        paymentStatus: 'APPROVED',
        pickupCode: generatePickupCode(existingReservation!.user.firstName, reservationId),
        statusHistory: {
          create: {
            status: 'PAID',
            notes: 'Pago aprobado',
          },
        },
      },
      include: { items: true },
    });

    const statusHistory = await tx.reservation_status_history.findFirst({
      where: { reservationId: reservationUpdated.id, status: 'PAID' },
    });

    // B. Actualizar inventario (reducir stock)
    for (const item of reservationUpdated.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // C. Asignar empleado automáticamente
    const availableEmployee = await tx.employee.findFirst({
      where: { isActive: true },
    });

    if (availableEmployee && statusHistory) {
      await tx.reservation.update({
        where: { id: existingReservation!.id },
        data: { employeeId: availableEmployee.id },
      });

      await tx.reservation_status_history.update({
        where: { id: statusHistory.id },
        data: { employeeId: availableEmployee.id },
      });
    }

    // Delete cart
    await prisma.cart.deleteMany({ where: { userId: existingReservation!.userId } });
  });
};
