import { MercadoPagoConfig, Preference, Payment, MerchantOrder } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);
export const merchantOrderClient = new MerchantOrder(client);