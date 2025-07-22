import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export class NotificationModel {
  static async getNotificationsByVerificationCode(verificationCode: string) {
    return await prisma.user.findUnique({
      where: { verifyCode: verificationCode },
      omit: { password: true, twoFactorEnabled: true, refreshToken: true },
    });
  }
}
