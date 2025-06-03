import { AdminGuard } from './admin.guard';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('powinien być zdefiniowany', () => {
    expect(guard).toBeDefined();
  });

  it('powinien zwracać true, jeśli użytkownik jest administratorem', () => {
    const mockUser = { has_admin_privileges: true };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: mockUser }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('powinien rzucać UnauthorizedException, jeśli użytkownik nie jest zalogowany', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: null }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'Użytkownik nie jest zalogowany.',
    );
  });

  it('powinien rzucać ForbiddenException, jeśli użytkownik nie ma uprawnień administratora', () => {
    const mockUser = { has_admin_privileges: false };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: mockUser }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow(
      'Brak uprawnień administratora.',
    );
  });
});
