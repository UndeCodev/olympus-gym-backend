import { JWT_SECRET } from '../../../shared/config/env';
import { MyMembershipStatusResponse } from '../interfaces/my_membership_status.response';
import { UserMembershipModel } from '../models/user_membership.model';
import jwt from 'jsonwebtoken';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const getMyStatusService = async (userId: number): Promise<MyMembershipStatusResponse> => {
  // 1. Buscar la última membresía activa
  const membership = await UserMembershipModel.findLatestActive(userId);
  const now = new Date();

  // CASO A: No tiene membresía o ya venció hace mucho
  if (!membership) {
    return {
      hasActiveMembership: false,
      planName: 'Sin Plan',
      endDate: null,
      status: 'Sin Membresía',
      qrToken: null,
      securityNote: '',
    };
  }

  // CASO B: Tiene membresía, verificamos si sigue vigente hoy
  const isActive = membership.endDate > now && membership.status === 'ACTIVE';
  const statusText = isActive ? 'Activa' : 'Vencida';

  // 2. Generar el Token para el QR (Lógica de seguridad de 24 horas)
  let qrToken: string | null = null;

  if (isActive) {
    const payload = {
      uid: userId,
      plan: membership.plan.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Expira en 24 horas
    };

    // Usamos la misma clave secreta de tu env (o una específica para QRs)
    qrToken = jwt.sign(payload, JWT_SECRET || 'secret', { algorithm: 'HS256' });
  }

  return {
    hasActiveMembership: isActive,
    planName: membership.plan.name,
    endDate: formatDate(membership.endDate),
    status: statusText,
    qrToken: qrToken,
    securityNote: `Código generado el ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`,
  };
};
