import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { CraftmanService } from './craftman.service';
import { CreateCraftmanDto } from './dto/create-craftman.dto';
import { UpdateCraftmanDto } from './dto/update-craftman.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CustomRequest } from '../../../types/express-request.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Craftsman } from './entities/craftman.entity';
import { CommonResponseDto } from 'src/interceptors/CommonResponseDto';

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
    const data = await this.craftmanService.createCraftman(createCraftmanDto, userId);

    return new CommonResponseDto('success', 'Creaftman Registered successfully', data, HttpStatus.OK);
  }

  @Get()
  findAll() {
    return this.craftmanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.craftmanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCraftmanDto: UpdateCraftmanDto) {
    return this.craftmanService.update(+id, updateCraftmanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.craftmanService.remove(+id);
  }
}
