import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { CommonResponseDto } from 'src/interceptors/CommonResponseDto'; // Ensure this path is correct
import { UserRegisterResponseDto } from './dto/user-register-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    // type: CommonResponseDto,
    schema: {
      example: {
        status: 'success',
        message: 'User registered successfully',
        data: {
          user_id: 'e2b8b74b-4c5e-4a0b-847e-cf1c7bbd1b7e',
          email: 'john.doe@example.com',
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
  async register(@Body() createUserDto: CreateUserDto): Promise<CommonResponseDto<any>> {
    // Use User type

    const { userName, password, email } = createUserDto;

    const user = await this.authService.register(userName, password, email);

    const userResponse: UserRegisterResponseDto = {
      user_id: user.id,
      email: user.email,
      registrationDate: user.registrationDate,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return new CommonResponseDto('success', 'User registered successfully', userResponse, HttpStatus.CREATED);
  }
}
