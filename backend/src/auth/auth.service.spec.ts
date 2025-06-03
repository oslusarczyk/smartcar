import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '@/users/dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('powinien zwrócić token i użytkownika, jeśli dane są poprawne', async () => {
      const mockUser = {
        userId: 1,
        id: 1,
        email: 'test@example.com',
        has_admin_privileges: false,
        password: 'hashedpassword',
      };
      const mockAccessToken = 'mock_access_token';

      jest.spyOn(usersService, 'login').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

      const result = await service.signIn(loginUserDto);

      expect(usersService.login).toHaveBeenCalledWith(loginUserDto);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.userId,
        id: mockUser.id,
        email: mockUser.email,
        has_admin_privileges: mockUser.has_admin_privileges,
      });
      expect(result).toEqual({
        access_token: mockAccessToken,
        user: {
          userId: mockUser.userId,
          id: mockUser.id,
          email: mockUser.email,
          has_admin_privileges: mockUser.has_admin_privileges,
        },
      });
    });

    it('powinien rzucać UnauthorizedException, jeśli użytkownik nie istnieje', async () => {
      jest.spyOn(usersService, 'login').mockResolvedValue(null);

      await expect(service.signIn(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(loginUserDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
