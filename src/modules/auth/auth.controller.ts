import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
// import { CommonResponseDto } from 'src/interceptors/CommonResponseDto'; // Ensure this path is correct
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { string } from 'joi';
import { EmailService } from '../email/email.service';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    schema: {
      example: {
        status: 'success',
        message: 'User registered successfully',
        data: {
          user_id: 'e2b8b74b-4c5e-4a0b-847e-cf1c7bbd1b7e',
          email: string,
          registration_date: '2024-08-11T12:00:00.000Z',
          created_at: '2024-08-11T12:00:00.000Z',
          updated_at: '2024-08-11T12:00:00.000Z',
        },
        statusCode: 201,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User account already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    // Use User type

    const { userName, password, email } = createUserDto;

    const user = await this.authService.register(userName, password, email);

    console.log('username', userName);
    console.log('useremail', user.email);

    return await this.emailService.sendWelcomeEmail(user.userName, user.email);

    // return new CommonResponseDto('success', 'User registered successfully', userResponse, HttpStatus.CREATED);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user return userId email and set access and refresh cookies' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    // type: ResponseDto,
    schema: {
      example: {
        status: 'success',
        message: 'User successfully logged in',
        data: {
          user_id: 'e2b8b74b-4c5e-4a0b-847e-cf1c7bbd1b7e',
          email: 'example@gmail.com',
          updated_at: '2024-08-11T12:00:00.000Z',
        },
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { email, password } = loginDto;

    const { user } = await this.authService.login(email, password, res);

    return user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout successful' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'An error occurred during logout' })
  async logout(@Req() request: Request, @Res() res) {
    const user = request['user'];
    const userId = user.sub;
    // const data =
    return await this.authService.logout(userId, res);

    // return new CommonResponseDto('success', 'User Logged out successfully', data, HttpStatus.OK);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refreshes the access token' }) // Summary of what this endpoint does
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    // type: CommonResponseDto, // Response DTO class
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing refresh token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(AuthGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    await this.authService.refreshToken(req, res); // Await the refreshToken method
  }
}
