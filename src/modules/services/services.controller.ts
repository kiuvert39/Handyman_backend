import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
// import { CommonResponseDto } from 'src/interceptors/CommonResponseDto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../helpers/roles.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { PaginationDto } from './dto/paginated-services.dto';
import { Service } from './entities/service.entity';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiBearerAuth()
  @Post('createService')
  @Roles(Role.Admin) // Ensure only admins can create a service
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({
    status: 200,
    description: 'Successful request',
    schema: {
      example: {
        statusCode: 200,
        message: 'Request was successful',
        data: {
          service_id: 1,
          service_name: 'Plumbing',
          description: 'Fixes leaks and other plumbing issues',
          category: 'Home Repair',
          price: 100.0,
          created_at: '2024-08-29T12:34:56Z',
          updated_at: '2024-08-29T12:34:56Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins are allowed to access this route.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Only admins are allowed to access this route',
        data: null,
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        data: null,
        error: 'Unauthorized',
      },
    },
  })
  async create(@Body() createServiceDto: CreateServiceDto) {
    //  const data = await
    console.log(createServiceDto);
    return this.servicesService.create(createServiceDto);
    // return new CommonResponseDto('success', 'Craftsman updated successfully', data, HttpStatus.OK);
  }

  @Get('get-all_services')
  @ApiOperation({ summary: 'retrieved all services with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all services with pagination',
    schema: {
      example: {
        statusCode: 200,
        status: 'success',
        message: 'Operation successful',
        data: {
          page: 1,
          pageSize: 10,
          totalItems: 50,
          totalPages: 5,
          items: [
            {
              service_id: 1,
              service_name: 'Plumbing',
              description: 'Fixes leaks and other plumbing issues',
              category: 'Home Repair',
              price: 100.0,
              created_at: '2024-08-29T12:34:56Z',
              updated_at: '2024-08-29T12:34:56Z',
            },
            // More service items
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAllServices(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ): Promise<PaginationDto<CreateServiceDto>> {
    return await this.servicesService.getAllServices(page, pageSize);
  }

  @ApiOperation({ summary: 'Get a specific service by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the service',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully retrieved',
    schema: {
      example: {
        statusCode: 200,
        status: 'success',
        message: 'Operation successful',
        data: {
          id: '496d97e3-b68b-4c19-8967-7a341b8b03c2',
          created_at: '2024-09-03T09:49:39.758Z',
          updated_at: '2024-09-03T09:49:39.758Z',
          service_name: 'Plumbing Repair',
          description: 'Fixing leaks, installing pipes, and other plumbing services.',
          category: 'capenter',
          price: '150.00',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service with ID 496d97e3-b68b-4c19-8967-7a341b8b03c9 not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'invalid input syntax for type uuid: "496d97e3-b68b-4c19-8967-7a341b8b03c"',
      },
    },
  })
  @Get('getServiceById/:id')
  getServiceById(@Param('id') serviceId: string): Promise<Service> {
    return this.servicesService.getServiceById(serviceId);
  }

  @Patch('updateService/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a specific service by ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The ID of the service',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The service has been successfully updated',
    schema: {
      example: {
        statusCode: 200,
        status: 'success',
        message: 'Operation successful',
        data: {
          id: '496d97e3-b68b-4c19-8967-7a341b8b03c2',
          created_at: '2024-09-03T09:49:39.758Z',
          updated_at: '2024-09-03T09:49:39.758Z',
          service_name: 'Plumbing Repair',
          description: 'Fixing leaks, installing pipes, and other plumbing services.',
          category: 'capenter',
          price: '150.00',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service with ID 496d97e3-b68b-4c19-8967-7a341b8b03c9 not found',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Price must be a valid number',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'invalid input syntax for type uuid: "496d97e3-b68b-4c19-8967-7a341b8b03c"',
      },
    },
  })
  @ApiBearerAuth()
  update(@Param('id') serviceId: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.updateService(serviceId, updateServiceDto);
  }

  @Delete('deleteService/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a service by ID' })
  @ApiResponse({
    status: 204,
    description: 'Service successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service with ID dd346420-ae0d-477f-b378-85b04e1f838d not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'An unexpected error occurred while deleting the service',
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT) // Set the status code to 204 for successful deletion
  async deleteService(@Param('id') id: string): Promise<void> {
    await this.servicesService.delete(id);
  }
}
