import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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
    return await this.UserRepository.findOne({
      where: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }
}
