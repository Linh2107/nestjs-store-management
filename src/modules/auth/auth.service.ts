import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    const token = this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }

  async login(email, password) {
    const user = await this.userService.findByLogin(email, password);
    const token = this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(email: string) {
    const user = await this.userService.findOne({ email });
    return user;
  }

  private _createToken({ email }): any {
    const accessToken = this.jwtService.sign({ email });
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }
}
