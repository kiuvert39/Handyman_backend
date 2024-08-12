import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service'; // Import UsersService

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            // Mock methods of UsersService
            findOneByUsernameAndEmail: jest.fn().mockResolvedValue(null), // Adjust mock implementation
            createUser: jest.fn().mockResolvedValue({}), // Adjust mock implementation
          },
        },
        // Add other providers or dependencies if necessary
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService); // Ensure AuthService is also retrieved if needed
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Add other tests as needed
});
