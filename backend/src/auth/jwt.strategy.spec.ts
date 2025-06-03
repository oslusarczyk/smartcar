import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'testsecret';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('powinien być zdefiniowany', () => {
    expect(strategy).toBeDefined();
  });

  it('powinien rzucać błąd, jeśli JWT_SECRET nie jest zdefiniowany', () => {
    jest.spyOn(configService, 'get').mockReturnValue(null);
    expect(() => new JwtStrategy(configService)).toThrow(
      'JWT_SECRET is not defined',
    );
  });

  describe('validate', () => {
    it('powinien zwrócić payload', async () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const result = await strategy.validate(payload);
      expect(result).toEqual(payload);
    });
  });
});
