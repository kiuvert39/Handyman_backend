import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and save a user', async () => {
      const userDto = { userName: 'testUser', _password: 'testPass', email: 'test@example.com' };
      const createdUser = { ...userDto, id: 1 }; // Mocked user object with an id

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.createUser(userDto.userName, userDto._password, userDto.email);

      expect(result).toEqual(createdUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should handle errors when creating a user', async () => {
      const userDto = { userName: 'testUser', _password: 'testPass', email: 'test@example.com' };
      const error = new Error('Database error');

      mockUserRepository.create.mockReturnValue(userDto);
      mockUserRepository.save.mockRejectedValue(error);

      await expect(service.createUser(userDto.userName, userDto._password, userDto.email)).rejects.toThrowError(
        'Database error'
      );
    });
  });

  describe('findOneByUsernameAndEmail', () => {
    it('should find a user by username and email', async () => {
      const user = { userName: 'testUser', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneByUsernameAndEmail('testUser', 'test@example.com');

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: [{ email: 'test@example.com' }, { userName: 'testUser' }],
      });
    });

    it('should handle errors when finding a user', async () => {
      const error = new Error('Database error');
      mockUserRepository.findOne.mockRejectedValue(error);

      await expect(service.findOneByUsernameAndEmail('testUser', 'test@example.com')).rejects.toThrowError(
        'Database error'
      );
    });

    it('should return null if no user is found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByUsernameAndEmail('testUser', 'test@example.com');

      expect(result).toBeNull();
    });

    it('should throw an error when user creation fails', async () => {
      const userName = 'testUser';
      const password = 'password123';
      const email = 'test@example.com';

      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(service.createUser(userName, password, email)).rejects.toThrow('Database error');
    });
  });
});
