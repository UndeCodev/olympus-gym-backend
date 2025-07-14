import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { PUBLIC_API_URL, PUBLIC_FRONTEND_URL } from '../../../shared/config/env';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { preferenceClient } from '../../../shared/lib/mercadoPago';

const prisma = new PrismaClient();

interface CreatePreferenceParams {
  userId: number;
  items: Array<{
    productId: number;
    title: string;
    unit_price: number;
    quantity: number;
    category: string;
  }>;
}

export const createPaymentPreference = async ({ userId, items }: CreatePreferenceParams) => {
  // 1. Validar stock disponible
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product || product.stock < item.quantity) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: `Stock insuficiente para ${item.title}`,
      });
    }
  }

  // 2. Calcular totales (IVA 16% México)
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const taxAmount = subtotal * 0.16;
  const total = subtotal + taxAmount;

  // 3. Crear reserva en la base de datos
  const reservation = await prisma.reservation.create({
    data: {
      userId,
      subtotal,
      taxAmount,
      totalAmount: total,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.unit_price,
          name: item.title,
          category: item.category,
        })),
      },
      statusHistory: {
        create: {
          status: 'PENDING',
          notes: 'Reserva creada',
        },
      },
    },
    include: { user: true },
  });

  // 4. Create preference with MercadoPago
  try {
    const preference = await preferenceClient.create({
      body: {
        items: items.map((item) => ({
          id: item.productId.toString(),
          title: item.title,
          unit_price: item.unit_price,
          quantity: item.quantity,
          description: `Producto: ${item.title}`,
          category_id: 'products',
        })),
        payer: {
          email: reservation.user.email,
          name: `${reservation.user.firstName} ${reservation.user.lastName}`,
          phone: {
            area_code: reservation.user.phoneNumber.substring(0, 3),
            number: reservation.user.phoneNumber.substring(3),
          },
        },
        payment_methods: {
          excluded_payment_types: [{ id: 'atm' }],
          installments: 12, 
          default_installments: 1,
        },
        external_reference: `order_${reservation.id}`,
        notification_url: `${PUBLIC_API_URL}/orders/webhooks/mercadopago`,
        back_urls: {
          success: `${PUBLIC_FRONTEND_URL}/checkout/success`,
          failure: `${PUBLIC_FRONTEND_URL}/checkout/failure`,
          pending: `${PUBLIC_FRONTEND_URL}/checkout/pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'OlYMPUS GYM',
        binary_mode: true,
        taxes: [
          {
            type: 'IVA',
            value: 16.0,
          },
        ],
        metadata: {
          reservation_id: reservation.id,
          user_id: userId,
          type: 'GYM_PICKUP',
        },
      },
    });

    console.log({ preference });

    // 5. Update reservation with MercadoPago data
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        mercadoPagoReferenceId: String(preference.collector_id),
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Preferencia de pago creada en Mercado Pago',
          },
        },
      },
    });

    return {
      initPoint: preference.init_point,
    };
  } catch (error) {
    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError({
          httpCode: HttpCode.CONFLICT,
          description: `La referencia de pago en Mercado Pago ya fue creada.`,
        });
      }
    }

    throw new AppError({
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Error al crear el pago en Mercado Pago',
    });
  }
};
