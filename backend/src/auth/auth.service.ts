import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '@/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.usersService.login(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.userId,
      id: user.id,
      email: user.email,
      has_admin_privileges: user.has_admin_privileges,
    };
    const { password, ...userWithoutPassword } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }
}
