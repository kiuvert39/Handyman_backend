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
    const user = this.UserRepository.create({ userName, _password: password, email });
    return this.UserRepository.save(user);
  }

  async findOneByUsernameAndEmail(userName: string, email: string) {
    return await this.UserRepository.findOne({
      where: [{ email }, { userName }],
    });
  }
}
