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
import { Role } from 'src/helpers/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.servicesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
  //   return this.servicesService.update(+id, updateServiceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.servicesService.remove(+id);
  // }
}
