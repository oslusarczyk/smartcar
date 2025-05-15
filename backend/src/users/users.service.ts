import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log('isPasswordValid', isPasswordValid);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Niepoprawne dane logowania');
    // }
    return user;
  }

  async register(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    console.log('email', email);
    // console.log('password', password);
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = await this.prisma.user.create({
    //   data: {
    //     email: email,
    //     password: hashedPassword,
    //   },
    // });
    // return user;
  }
}
