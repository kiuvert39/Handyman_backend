import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { describe, it } from 'node:test';

// Mock bcrypt implementation
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsernameAndEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userName = 'testUser';
      const password = 'testPass';
      const email = 'test@example.com';
      const hashedPassword = 'hashedPassword';
      const createdUser = { userName, email, id: 1 };

      (usersService.findOneByUsernameAndEmail as jest.Mock).mockResolvedValue(null);
      (usersService.createUser as jest.Mock).mockResolvedValue(createdUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.register(userName, password, email);
    });

    it('should throw ConflictException if user already exists', async () => {
      const userName = 'testUser';
      const email = 'test@example.com';

      (usersService.findOneByUsernameAndEmail as jest.Mock).mockResolvedValue({ userName, email });

      await expect(service.register(userName, 'testPass', email)).rejects.toThrow(ConflictException);
      expect(usersService.findOneByUsernameAndEmail).toHaveBeenCalledWith(userName, email);
    });
  });
});
function expect(service: AuthService) {
  throw new Error('Function not implemented.');
}
