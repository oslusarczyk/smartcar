import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let bcryptCompare: jest.Mock;
  let bcryptHash: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    bcryptCompare = bcrypt.compare as jest.Mock;
    bcryptHash = bcrypt.hash as jest.Mock;

    jest.clearAllMocks();
  });

  it('powinien być zdefiniowany', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'correctpassword',
    };
    const mockUser = {
      id: 'user-id-1',
      email: 'test@example.com',
      password: 'hashedpassword',
      userId: 'user-id-1',
      has_admin_privileges: false,
    };

    it('powinien zwrócić użytkownika, jeśli dane logowania są poprawne', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      bcryptCompare.mockResolvedValue(true);

      const result = await service.login(loginUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      expect(bcryptCompare).toHaveBeenCalledWith(
        loginUserDto.password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('powinien rzucić UnauthorizedException, jeśli użytkownik nie istnieje', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      expect(bcryptCompare).not.toHaveBeenCalled();
    });

    it('powinien rzucić UnauthorizedException, jeśli hasło jest niepoprawne', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      bcryptCompare.mockResolvedValue(false);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
      });
      expect(bcryptCompare).toHaveBeenCalledWith(
        loginUserDto.password,
        mockUser.password,
      );
    });
  });

  describe('register', () => {
    const registerUserDto: LoginUserDto = {
      email: 'newuser@example.com',
      password: 'newsecurepassword',
    };
    const hashedPassword = 'hashednewpassword';
    const createdUser = {
      id: 'new-user-id-1',
      email: 'newuser@example.com',
      password: hashedPassword,
      userId: 'new-user-id-1',
      has_admin_privileges: false,
    };

    it('powinien zarejestrować nowego użytkownika, jeśli email jest unikalny', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      bcryptHash.mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await service.register(registerUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerUserDto.email },
      });
      expect(bcryptHash).toHaveBeenCalledWith(registerUserDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerUserDto.email,
          password: hashedPassword,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('powinien rzucić ConflictException, jeśli użytkownik z danym emailem już istnieje', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(createdUser);

      await expect(service.register(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerUserDto.email },
      });
      expect(bcryptHash).not.toHaveBeenCalled();
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });
});
