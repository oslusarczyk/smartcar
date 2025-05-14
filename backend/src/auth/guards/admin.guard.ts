import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('request', request);
    const user = request.user;
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Użytkownik nie jest zalogowany.');
    }

    if (!user.has_admin_privileges) {
      throw new ForbiddenException('Brak uprawnień administratora.');
    }
    return true;
  }
}
