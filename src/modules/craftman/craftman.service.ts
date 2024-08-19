import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCraftmanDto } from './dto/create-craftman.dto';
import { UpdateCraftmanDto } from './dto/update-craftman.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Craftsman } from './entities/craftman.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ACCOUNT_NOT_VERIFY, REGISTERED_CRAFTMAN } from 'src/helpers/SystemMessages';

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

  findAll() {
    return `This action returns all craftman`;
  }

  findOne(id: number) {
    return `This action returns a #${id} craftman`;
  }

  update(id: number, updateCraftmanDto: UpdateCraftmanDto) {
    return `This action updates a #${id} craftman`;
  }

  remove(id: number) {
    return `This action removes a #${id} craftman`;
  }
}
