import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto, LoginDto } from '../user/user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.stategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.service.register(dto);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    return this.service.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return req.user;
  }
}
