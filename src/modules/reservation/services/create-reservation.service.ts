import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";
import { CartModel } from "../../cart/models/cart.model"
import { createPaymentPreference } from "./create-payment-preference.service";

export const createReservationService = async (cartId: number, userId: number) => {
    const cart = await CartModel.getOrCreateUserCart(cartId);

    if (!cart) {
        throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: "Carrito no encontrado",
        })
    }

    if(cart.items.length === 0) {
        throw new AppError({
            httpCode: HttpCode.CONFLICT,
            description: "El carrito no puede estar vacio",
        })
    }

    const { initPoint } = await createPaymentPreference({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId,
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
    });

    return initPoint
}