import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/users.service';
import { LoginUserDto } from '@/users/dto/login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('powinien być zdefiniowany', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('powinien wywołać authService.signIn z poprawnymi danymi', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { access_token: 'some_token', user: { email: 'test' } };
      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      await controller.signIn(loginDto);
      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
    });

    it('powinien zwrócić wynik z authService.signIn', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { access_token: 'some_token', user: { email: 'test' } };
      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await controller.signIn(loginDto)).toEqual(result);
    });
  });

  describe('register', () => {
    it('powinien wywołać usersService.register z poprawnymi danymi', async () => {
      const registerDto: LoginUserDto = {
        email: 'newuser@example.com',
        password: 'newpassword',
      };
      const result = { id: 1, email: 'newuser@example.com' };
      jest.spyOn(usersService, 'register').mockResolvedValue(result);

      await controller.register(registerDto);
      expect(usersService.register).toHaveBeenCalledWith(registerDto);
    });

    it('powinien zwrócić wynik z usersService.register', async () => {
      const registerDto: LoginUserDto = {
        email: 'newuser@example.com',
        password: 'newpassword',
      };
      const result = { id: 1, email: 'newuser@example.com' };
      jest.spyOn(usersService, 'register').mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
    });
  });
});
