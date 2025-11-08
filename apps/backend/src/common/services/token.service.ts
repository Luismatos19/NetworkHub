import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TOKEN_EXPIRATION_DAYS } from '../constants/status.constants';

@Injectable()
export class TokenService {
  generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  calculateExpirationDate(): Date {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + TOKEN_EXPIRATION_DAYS);
    return expirationDate;
  }

  isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}

