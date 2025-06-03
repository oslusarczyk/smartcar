import { LoginUserDto } from './login-user.dto';
import { validate } from 'class-validator';

describe('LoginUserDto', () => {
  it('powinien być zdefiniowany', () => {
    expect(new LoginUserDto()).toBeDefined();
  });

  describe('email', () => {
    it('powinien przejść walidację, jeśli email jest poprawny', async () => {
      const dto = new LoginUserDto();
      dto.email = 'test@example.com';
      dto.password = 'password123';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('powinien nie przejść walidacji, jeśli email jest pusty', async () => {
      const dto = new LoginUserDto();
      dto.email = '';
      dto.password = 'password123';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('powinien nie przejść walidacji, jeśli email jest niepoprawny', async () => {
      const dto = new LoginUserDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });
  });

  describe('password', () => {
    it('powinien przejść walidację, jeśli hasło ma więcej niż 8 znaków', async () => {
      const dto = new LoginUserDto();
      dto.email = 'test@example.com';
      dto.password = 'verysecurepassword';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('powinien nie przejść walidacji, jeśli hasło ma mniej niż 8 znaków', async () => {
      const dto = new LoginUserDto();
      dto.email = 'test@example.com';
      dto.password = 'short';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
      expect(errors[0].constraints?.minLength).toBe(
        'Hasło musi mieć więcej niz 8 znaków.',
      );
    });

    it('powinien nie przejść walidacji, jeśli hasło nie jest stringiem', async () => {
      const dto = new LoginUserDto();
      dto.email = 'test@example.com';
      (dto as any).password = 12345678;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });
});
