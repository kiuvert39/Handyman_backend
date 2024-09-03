import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PaginationDto } from './dto/paginated-services.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      const { category } = createServiceDto;

      const existingService = await this.serviceRepository
        .createQueryBuilder('service')
        .where('service.category = :category', { category })
        .getOne();

      if (existingService) {
        throw new BadRequestException(`A service with the category '${category}' already exists`);
      }

      const createdService = this.serviceRepository.create(createServiceDto);
      return await this.serviceRepository.save(createdService);
    } catch (error) {
      if (error instanceof BadRequestException) {
        // Preserve the original BadRequestException message
        throw error;
      }

      if (error instanceof QueryFailedError) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('duplicate key value violates unique constraint')) {
          throw new BadRequestException('A service with the same category already exists');
        }
      }

      throw new InternalServerErrorException('Failed to create service');
    }
  }

  async getAllServices(page: number, pageSize: number): Promise<PaginationDto<CreateServiceDto>> {
    try {
      if (!page || !pageSize) {
        throw new BadRequestException('Page and pageSize must be provided and greater than 0');
      }

      if (page < 1 || pageSize < 1) {
        throw new BadRequestException('Page and pageSize must be greater than 0');
      }

      const skip = (page - 1) * pageSize;

      // Fetch services and total count
      const [services, totalItems] = await this.serviceRepository.findAndCount({
        skip,
        take: pageSize,
      });

      const totalPages = Math.ceil(totalItems / pageSize);

      // Transform services data to DTOs
      const items = services.map(service => ({
        service_id: service.id,
        service_name: service.service_name,
        description: service.description,
        category: service.category,
        price: service.price,
        created_at: service.created_at.toISOString(),
        updated_at: service.updated_at.toISOString(),
      }));

      // Return paginated result
      return {
        page,
        pageSize,
        totalItems,
        totalPages,
        items,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('An error occurred while fetching services');
    }
  }

  async getServiceById(serviceId: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    return service;
  }

  async updateService(serviceId: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    this.logger.debug(`Updating service with ID ${serviceId} and DTO: ${JSON.stringify(updateServiceDto)}`);

    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    if (updateServiceDto.category) {
      const existingCategoryService = await this.serviceRepository
        .createQueryBuilder('service')
        .where('service.category = :category AND service.id != :serviceId', {
          category: updateServiceDto.category,
          serviceId,
        })
        .getOne();

      this.logger.debug(`Checking category '${updateServiceDto.category}' found: ${!!existingCategoryService}`);

      if (existingCategoryService) {
        throw new BadRequestException(`A service with the category '${updateServiceDto.category}' already exists`);
      }
    }

    Object.assign(service, updateServiceDto);

    return this.serviceRepository.save(service);
  }

  async delete(id: string): Promise<void> {
    try {
      const deleteResult = await this.serviceRepository.delete(id);

      if (deleteResult.affected === 0) {
        this.logger.warn(`Service with ID ${id} not found`);
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      if (deleteResult.affected < 0) {
        this.logger.error('An unexpected error occurred while deleting the service');
        throw new InternalServerErrorException('An unexpected error occurred while deleting the service');
      }
    } catch (error) {
      this.logger.error('Error deleting service', error.stack);
      throw new InternalServerErrorException('An unexpected error occurred while deleting the service');
    }
  }
}
