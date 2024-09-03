import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  Query,
  ParseIntPipe,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CreateCraftmanDto } from './dto/create-craftman.dto';

import { AuthGuard } from 'src/guards/auth.guard';
import { CustomRequest } from '../../../types/express-request.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Craftsman } from './entities/craftman.entity';
// import { CommonResponseDto } from 'src/interceptors/CommonResponseDto';
import { CraftsmanDto } from './dto/craftman.dto';
import { UpdateCraftsmanDto } from './dto/updateCraftman.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/helpers/roles.enum';

@ApiTags('Craftsmen') // Tag for grouping APIs in Swagger
// @UseGuards(AuthGuard)
@Controller('craftman')
export class CraftmanController {
  constructor(private readonly craftmanService: CraftmanService) {}

  @Post('register-craftman')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new craftsman' }) // Summary of the operation
  @ApiBody({ type: CreateCraftmanDto }) // Specifies the expected body of the request
  @ApiResponse({
    status: 200,
    description: 'Craftsman registered successfully',
    schema: {
      example: {
        'application/json': {
          value: {
            status: 'success',
            message: 'Craftsman Registered successfully',
            data: {
              craftsmanId: 'b8542964-0fc8-4003-a4bc-11924ad50834',
              userId: '476ee1b9-a045-49ea-a1bc-47842bec9e1c',
              userName: 'kliuvert',
              skills: 'Carpentry, Plumbing, electrician',
              experience: 5,
              isAvailable: true,
              createdAt: '2024-08-19T07:20:13.357Z',
            },
            statusCode: 200,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        'application/json': {
          value: {
            status: 'error',
            message: 'Error saving craftsman',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User must verify their account before registering as a craftsman',
    schema: {
      example: {
        'application/json': {
          value: {
            status: 'error',
            message: 'User must verify their account before registering as a craftsman',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already registered as a craftsman',
    schema: {
      example: {
        'application/json': {
          value: {
            status: 'error',
            message: 'User is already registered as a craftsman',
            error: 'Conflict',
            statusCode: 409,
          },
        },
      },
    },
  })
  async createCraftman(@Body() createCraftmanDto: CreateCraftmanDto, @Req() request: Request) {
    const user = request['user'];
    const userId = user.sub;
    console.log('User ID:', userId);
    // const data =
    return this.craftmanService.createCraftman(createCraftmanDto, userId);

    // return new CommonResponseDto('success', 'Creaftman Registered successfully', data, HttpStatus.OK);
  }

  @Get('get-All_craftmen')
  @ApiOperation({ summary: 'Retrieve a paginated list of craftsmen' })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'pageSize', type: Number, description: 'Number of items per page', example: 1 })
  @ApiOkResponse({
    description: 'Successful response with paginated list of craftsmen',
    schema: {
      example: {
        status: 'success',
        message: 'All Craftmen retrieved successfully',
        data: {
          page: 1,
          pageSize: 1,
          totalItems: 3,
          totalPages: 3,
          items: [
            {
              id: 'a9c11301-bc6c-4ae8-b5e5-0bb656b47dfe',
              created_at: '2024-08-19T06:48:16.286Z',
              updated_at: '2024-08-19T06:48:16.286Z',
              skillSet: 'Carpentry, Plumbing, electrician',
              experience: 5,
              certifications: 'Certified Carpenter',
              isAvailable: true,
              rating: null,
              user: {
                userId: 'd283303f-4818-44d1-b57d-7df7db2e2dc9',
                created_at: '2024-08-15T09:51:01.122Z',
                updated_at: '2024-08-15T09:51:01.122Z',
                userName: 'janice134',
                firstName: null,
                lastName: null,
                email: 'janicekliuverty33@gmail.com',
                phoneNumber: null,
                address: null,
                role: null,
                languagePreference: null,
                registrationDate: '2024-08-15T09:51:01.122Z',
                isVerified: false,
              },
            },
          ],
        },
        statusCode: 200,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid parameters',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid parameters',
        error: 'Bad Request',
      },
    },
  })
  async getAllCraftsmen(@Query('page', ParseIntPipe) page: number, @Query('pageSize', ParseIntPipe) pageSize: number) {
    // const data =
    return this.craftmanService.findAllCraftsmen(page, pageSize);

    // return new CommonResponseDto('success', 'All Craftmen retrieve successfully', data, HttpStatus.OK);
  }
  @Get('get-Craftman/:id')
  @ApiOperation({ summary: 'Get Craftsman by ID' })
  @ApiResponse({
    status: 200,
    description: 'Craftsman retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Craftsman retrieved successfully',
        data: {
          id: 'a9c11301-bc6c-4ae8-b5e5-0bb656b47dfe',
          created_at: '2024-08-19T06:48:16.286Z',
          updated_at: '2024-08-19T06:48:16.286Z',
          skillSet: 'Carpentry, Plumbing, electrician',
          experience: 5,
          certifications: 'Certified Carpenter',
          isAvailable: true,
          rating: null,
          user: {
            userId: 'd283303f-4818-44d1-b57d-7df7db2e2dc9',
            created_at: '2024-08-15T09:51:01.122Z',
            updated_at: '2024-08-15T09:51:01.122Z',
            userName: 'janice134',
            firstName: null,
            lastName: null,
            email: 'janicekliuverty33@gmail.com',
            phoneNumber: null,
            address: null,
            role: null,
            languagePreference: null,
            registrationDate: '2024-08-15T09:51:01.122Z',
            isVerified: false,
          },
        },
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Craftsman not found',
    schema: {
      example: {
        status: 'error',
        message: 'Craftsman not found',
        statusCode: 404,
      },
    },
  })
  async getCraftsmanById(@Param('id') id: string) {
    // const specificCraftman =
    return await this.craftmanService.findCraftsmanById(id);
    // return new CommonResponseDto('success', 'Craftsman retrieved successfully', specificCraftman, HttpStatus.OK);
  }
  // Promise<CommonResponseDto<CraftsmanDto>>

  @Patch('updateCraftman/:id')
  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Craftsman)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific craftsman' })
  @ApiBody({
    description: 'Request body for updating a craftsman',
    type: UpdateCraftsmanDto,
    examples: {
      example1: {
        summary: 'Example request body',
        value: {
          skillSet: 'Carpentry, Plumbing',
          experience: 7,
          certifications: 'Certified Electrician',
          isAvailable: false,
          rating: '4.5',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Craftsman updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Craftsman updated successfully',
        data: {
          id: 'b8542964-0fc8-4003-a4bc-11924ad50834',
          created_at: '2024-08-19T07:20:13.357Z',
          updated_at: '2024-08-21T09:17:16.868Z',
          skillSet: 'Carpentry, Plumbing',
          experience: 7,
          certifications: 'Certified Electrician',
          isAvailable: false,
          rating: '4.5',
          user: {
            userId: '476ee1b9-a045-49ea-a1bc-47842bec9e1c',
            created_at: '2024-08-11T21:13:44.249Z',
            updated_at: '2024-08-11T21:13:44.249Z',
            userName: 'kliuvert',
            firstName: null,
            lastName: null,
            email: 'kliuvert@gmail.com',
            phoneNumber: null,
            address: null,
            role: null,
            languagePreference: null,
            registrationDate: '2024-08-11T21:13:44.249Z',
            isVerified: false,
          },
        },
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Craftsman not found',
  })
  async updateCraftsman(@Param('id') id: string, @Body() updateCraftsmanDto: UpdateCraftsmanDto): Promise<any> {
    // const updatedCraftman = await
    return this.craftmanService.updateCraftmanBtId(id, updateCraftsmanDto);
    // return new CommonResponseDto('success', 'Craftsman updated successfully', updatedCraftman, HttpStatus.OK);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.craftmanService.deleteCraftsmanById;
  }
}
