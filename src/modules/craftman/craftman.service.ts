import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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

/**
 * Retrieves a paginated list of craftsmen.
 * @param page The page number to retrieve.
 * @param pageSize The number of items per page.
 * @returns A pagination object containing the list of craftsmen and pagination metadata.
 */

@Injectable()
export class CraftmanService {
  constructor(
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
}

// findOne(id: number) {
//   return `This action returns a #${id}  is craftman`;
// }

// update(id: number, updateCraftmanDto: UpdateCraftmanDto) {
//   return `This action updates a #${id} craftman`;
// }

// remove(id: number) {
//   return `This action removes a #${id} craftman`;
// }
