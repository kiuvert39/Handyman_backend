import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  FAILED_TO_CREATE_USER,
  INVALID_CREDENTIALS,
  INVALID_REFRESH_TOKEN,
  MISSING_REFRESH_TOKEN,
  SERVER_ERROR,
  USER_ACCOUNT_DOES_NOT_EXIST,
  USER_ACCOUNT_EXIST,
} from 'src/helpers/SystemMessages';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis.service';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { TokenService } from 'utils/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async validateUserCredentials(email: string, password: string) {
    const user = await this.usersService.findOneByUsernameAndEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch ? user : null;
  }

  async register(userName: string, password: string, email: string): Promise<any> {
    const existingUser = await this.usersService.findOneByUsernameAndEmail(email);

    if (existingUser) throw new ConflictException(USER_ACCOUNT_EXIST);

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      return await this.usersService.createUser(userName, hashedPassword, email);
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async login(email: string, password: string, res: any) {
    try {
      const user = await this.validateUserCredentials(email, password);

      if (!user) {
        throw new UnauthorizedException(INVALID_CREDENTIALS);
      }

      return await this.tokenService.generateAndSetTokens(user.id, user.userName, user.role, user.updated_at, res);
    } catch (error) {
      console.log(error);
      // If the error is of type UnauthorizedException, it should be propagated
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // For other types of errors, return a generic server error
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async refreshToken(req: any, res: any): Promise<any> {
    try {
      const refreshToken = req.cookies['refreshToken'];

      if (!refreshToken) {
        throw new UnauthorizedException(MISSING_REFRESH_TOKEN);
      }

      // Verify refresh token
      let decoded;
      try {
        decoded = this.jwtService.verify(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
      } catch (err) {
        throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
      }

      if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
        throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
      }

      const userId = decoded.sub;

      // Verify the refresh token in Redis
      const storedRefreshToken = await this.redisService.getRefreshToken(userId);

      if (storedRefreshToken !== refreshToken) {
        throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
      }

      // Generate new tokens
      const newAccessToken = this.jwtService.sign({ sub: userId });

      // Set new tokens as HTTP-only cookies
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      });

      res.status(HttpStatus.OK).json({ user_id: userId });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Server error');
    }
  }

  async logout(userId: string, res: any) {
    try {
      await this.redisService.deleteRefreshToken(userId);

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
      });

      res.status(200).json({
        message: 'Successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);

      throw new InternalServerErrorException('An error occurred during logout');
    }
  }
}
