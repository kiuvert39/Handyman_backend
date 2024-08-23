import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { updateUserDto } from './dto/updateUser.dto';
import { USER_ACCOUNT_DOES_NOT_EXIST } from 'src/helpers/SystemMessages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>
  ) {}

  async createUser(userName: string, password: string, email: string) {
    const user = this.UserRepository.create({ userName, password, email });
    return this.UserRepository.save(user);
  }

  async findOneByUsernameAndEmail(usernameOrEmail: string) {
    return await this.UserRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.userName = :usernameOrEmail', { usernameOrEmail })
      .orWhere('user.email = :usernameOrEmail', { usernameOrEmail })
      .getOne();
  }

  async updateUser(id: string, UpdateUserDto: updateUserDto) {
    try {
      const user = await this.UserRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException(USER_ACCOUNT_DOES_NOT_EXIST);

      const updatableFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'languagePreference'];

      updatableFields.forEach(field => {
        if (UpdateUserDto[field] !== undefined) {
          user[field] = UpdateUserDto[field];
        }
      });

      await this.UserRepository.save(user);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while updating the user');
    }
  }

  async getUsersById() {}
}
