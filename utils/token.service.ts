import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// Adjust the import based on your directory structure
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { RedisService } from 'src/modules/auth/redis.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {}

  async generateAndSetTokens(userId: string, userName: string, role: string, updatedAt: Date, res: any) {
    const payload: JwtPayload = { sub: userId, username: userName, role: role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY_TIMEFRAME'),
      }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
    });

    // Store the refresh token in Redis
    await this.redisService.setRefreshToken(userId, refreshToken);

    // Return the object that will be formatted by the common response interceptor
    return {
      user_id: userId,
      userName,
      updated_At: updatedAt, // Include the updated_At field
    };
  }
}
