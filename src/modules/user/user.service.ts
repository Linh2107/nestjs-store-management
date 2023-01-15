import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  findAll(condition, relations = null): Promise<User[]> {
    return this.repository.find({ where: condition, relations: relations });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.repository.findOne({ where: { email: dto.email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);
    dto.password = hash;
    return this.repository.save(dto);
  }

  async update() {
    //
  }

  async findOne(condition): Promise<User> {
    const user = await this.repository.findOne({ where: condition });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async findByLogin(email, password) {
    const user = await this.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
