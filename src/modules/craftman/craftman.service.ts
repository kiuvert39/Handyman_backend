import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCraftmanDto } from './dto/create-craftman.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Craftsman } from './entities/craftman.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ACCOUNT_NOT_VERIFY, REGISTERED_CRAFTMAN } from 'src/helpers/SystemMessages';
import { PaginationDto } from './dto/PaginationDto.dto';
import { CraftsmanDto } from './dto/craftman.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateCraftsmanDto } from './dto/updateCraftman.dto';

// import { Inject, CACHE_MANAGER } from '@nestjs/common';

/**
 * Retrieves a paginated list of craftsmen.
 * @param page The page number to retrieve.
 * @param pageSize The number of items per page.
 */

@Injectable()
export class CraftmanService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Craftsman)
    private readonly craftsmanRepository: Repository<Craftsman>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private readonly logger = new Logger(CraftmanService.name);

  async createCraftman(createCraftmanDto: CreateCraftmanDto, userId: string) {
    const { skillSet, experience, certifications, isAvailable } = createCraftmanDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    console.log(userId);
    const existingCraftsman = await this.craftsmanRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingCraftsman) {
      this.logger.error(`User with ID ${userId} is already registered as a craftsman.`);

      throw new ConflictException(REGISTERED_CRAFTMAN);
    }

    if (!user.isVerified) throw new ForbiddenException(ACCOUNT_NOT_VERIFY);

    user.role = 'craftsman';
    await this.userRepository.save(user);

    const craftsman = this.craftsmanRepository.create({
      skillSet: skillSet,
      experience: experience,
      certifications: certifications,
      isAvailable: isAvailable,
      user: user, // Associate the user with the craftsman
    });
    const savedCraftsman = await this.craftsmanRepository.save(craftsman);

    return {
      craftsmanId: savedCraftsman.id,
      userId: user.id,
      userName: user.userName,
      skills: savedCraftsman.skillSet,
      experience: savedCraftsman.experience,
      isAvailable: savedCraftsman.isAvailable,
      createdAt: savedCraftsman.created_at,
    };
  }

  async findAllCraftsmen(page: number, pageSize: number): Promise<PaginationDto<CraftsmanDto>> {
    try {
      if (page < 1 || pageSize < 1) {
        throw new BadRequestException('Page and pageSize must be greater than 0');
      }
      // Calculate the offset
      const skip = (page - 1) * pageSize;

      // Fetch craftsmen and total count in one query
      const [craftsmen, totalItems] = await this.craftsmanRepository.findAndCount({
        relations: ['user'], // Eager load user details to avoid multiple queries
        skip,
        take: pageSize,
      });

      const totalPages = Math.ceil(totalItems / pageSize);

      // Transform craftsmen data to DTOs
      const items: any = craftsmen.map(craftsman => ({
        id: craftsman.id,
        created_at: craftsman.created_at.toISOString(),
        updated_at: craftsman.updated_at.toISOString(),
        skillSet: craftsman.skillSet,
        experience: craftsman.experience,
        certifications: craftsman.certifications,
        isAvailable: craftsman.isAvailable,
        rating: craftsman.rating || null, // Ensure rating is null if undefined
        user: {
          userId: craftsman.user.id,
          created_at: craftsman.user.created_at.toISOString(),
          updated_at: craftsman.user.updated_at.toISOString(),
          userName: craftsman.user.userName,
          firstName: craftsman.user.firstName || null,
          lastName: craftsman.user.lastName || null,
          email: craftsman.user.email,
          phoneNumber: craftsman.user.phoneNumber || null,
          address: craftsman.user.address || null,
          role: craftsman.user.role || null,
          languagePreference: craftsman.user.languagePreference || null,
          registrationDate: craftsman.user.registrationDate.toISOString(),
          isVerified: craftsman.user.isVerified,
        },
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
      throw new InternalServerErrorException('An error o ccurred while fetching craftsmen');
    }
  }

  async findCraftsmanById(id: string): Promise<CraftsmanDto> {
    try {
      const craftsman = await this.craftsmanRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!craftsman) {
        throw new NotFoundException(`Craftsman with ID ${id} not found`);
      }

      const user = await this.userRepository.findOne({ where: { id: craftsman.user.id } });

      const result: CraftsmanDto = {
        id: craftsman.id,
        created_at: craftsman.created_at.toISOString(),
        updated_at: craftsman.updated_at.toISOString(),
        skillSet: craftsman.skillSet,
        experience: craftsman.experience,
        certifications: craftsman.certifications,
        isAvailable: craftsman.isAvailable,
        rating: craftsman.rating || null,
        user: {
          userId: user.id,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
          userName: user.userName,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          email: user.email,
          phoneNumber: user.phoneNumber || null,
          address: user.address || null,
          role: user.role || null,
          languagePreference: user.languagePreference || null,
          registrationDate: user.registrationDate.toISOString(),
          isVerified: user.isVerified,
        },
      };

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('An error o ccurred while fetching craftsmen');
    }
  }

  async updateCraftmanBtId(id: string, updateCraftsmanDto: UpdateCraftsmanDto): Promise<CraftsmanDto> {
    try {
      const craftsman = await this.craftsmanRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!craftsman) {
        throw new NotFoundException(`Craftsman with ID ${id} not found`);
      }

      await this.craftsmanRepository.update(id, updateCraftsmanDto);

      const updatedCraftsman = await this.craftsmanRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!updatedCraftsman) {
        throw new NotFoundException(`Craftsman with ID ${id} not found after update`);
      }

      const {
        id: craftsmanId,
        created_at,
        updated_at,
        skillSet,
        experience,
        certifications,
        isAvailable,
        rating,
        user: {
          id: userId,
          created_at: userCreatedAt,
          updated_at: userUpdatedAt,
          userName,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          role,
          languagePreference,
          registrationDate,
          isVerified,
        },
      } = updatedCraftsman;

      return {
        id: craftsmanId,
        created_at: created_at.toISOString(),
        updated_at: updated_at.toISOString(),
        skillSet,
        experience,
        certifications,
        isAvailable,
        rating: rating || null,
        user: {
          userId,
          created_at: userCreatedAt.toISOString(),
          updated_at: userUpdatedAt.toISOString(),
          userName,
          firstName: firstName || null,
          lastName: lastName || null,
          email,
          phoneNumber: phoneNumber || null,
          address,
          role,
          languagePreference,
          registrationDate: registrationDate.toISOString(),
          isVerified,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('An error o ccurred while fetching craftsman');
    }
  }

  async deleteCraftsmanById(id: string): Promise<void> {
    try {
      const craftsman = await this.craftsmanRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!craftsman) {
        throw new NotFoundException(`Craftsman with ID ${id} not found`);
      }

      const user = craftsman.user;
      user.role = 'customer';

      await this.userRepository.save(user);
      await this.craftsmanRepository.remove(craftsman);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting the craftsman');
    }
  }
}
