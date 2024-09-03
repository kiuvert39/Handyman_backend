import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { updateUserDto } from './dto/updateUser.dto';
// import { CommonResponseDto } from 'src/interceptors/CommonResponseDto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({
    description: 'The user data to update',
    type: updateUserDto,
    examples: {
      example1: {
        summary: 'Example of user data update',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '123-456-7890',
          address: '123 Main St',
          languagePreference: 'en',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    schema: {
      example: {
        id: 'e5c00a0d-31e6-4377-9c43-0fd2b7a7974b',
        userName: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
        address: '123 Main St',
        languagePreference: 'en',
        isVerified: true,
        created_at: '2024-08-21T09:17:16.868Z',
        updated_at: '2024-08-21T09:17:16.868Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while updating the user',
        error: 'Internal Server Error',
      },
    },
  })
  @Patch('update-users_profile')
  @UseGuards(AuthGuard)
  async updateUser(@Body() UpdateUserDto: updateUserDto, @Req() request: Request) {
    const user = request['user'];
    const userId = user.sub;

    // const User =
    return await this.userService.updateUser(userId, UpdateUserDto);

    // return new CommonResponseDto('success', 'User Updated successfully', User, HttpStatus.OK);
  }
}
