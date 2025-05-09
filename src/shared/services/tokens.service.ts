import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../../generated/prisma';
import { JWT_SECRET, JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } from '../config/env';
import { JwtPayload } from '../interfaces/JwtPayload';

const prisma = new PrismaClient();

class TokenService {
  private secret: string;
  private accessSecret: string;
  private refreshSecret: string;

  constructor() {
    this.secret = JWT_SECRET!;
    this.accessSecret = JWT_SECRET_ACCESS!;
    this.refreshSecret = JWT_SECRET_REFRESH!;
  }

  public generateVerificationToken(userId: number): string {
    console.log(this.secret);

    return jwt.sign({ id: userId }, this.secret, { expiresIn: '1h' });
  }

  public verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  public generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: '15min',
    });
  }

  public generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: '7d',
    });
  }

  public verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.accessSecret) as JwtPayload;
  }

  public verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.refreshSecret) as JwtPayload;
  }

  public async storeRefreshToken(token: string, userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  public async deleteRefreshToken(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  public async findRefreshToken(token: string) {
    return await prisma.user.findUnique({
      where: { refreshToken: token },
      select: { id: true, refreshToken: true },
    });
  }
}

export const tokenService = new TokenService();
