import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FAILED_TO_CREATE_USER, SERVER_ERROR, USER_ACCOUNT_EXIST } from 'src/helpers/SystemMessages';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(userName: string, password: string, email: string): Promise<any> {
    const existingUser = await this.usersService.findOneByUsernameAndEmail(userName, email);

    if (existingUser) throw new ConflictException(USER_ACCOUNT_EXIST);

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      return await this.usersService.createUser(userName, hashedPassword, email);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
