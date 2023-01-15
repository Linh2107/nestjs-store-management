import {
  Controller,
  Get,
  Req,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtAuthGuard } from '../auth/jwt-auth.stategy';
import { StoreService } from './store.service';
import { multerOptions } from '../../utils/file-upload';
import { StoreDto, StoreFilterDto } from './store.dto';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { User } from '../user/user.entity';
import { Query } from '@nestjs/common/decorators';

@Controller('store')
export class StoreController {
  constructor(private readonly service: StoreService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Query() query: StoreFilterDto, @AuthUser() user: User) {
    return this.service.findAll(query, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async detail(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return this.service.findOne({ id, userId: user.id });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  async create(
    @Body() storeDto: StoreDto,
    @UploadedFile() file,
    @AuthUser() user: User,
  ) {
    if (file) {
      storeDto.logo = file.path;
    }
    return this.service.create(storeDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() storeDto: StoreDto,
    @UploadedFile() file,
    @AuthUser() user: User,
  ) {
    if (file) {
      storeDto.logo = file.path;
    }
    return this.service.update(id, storeDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return this.service.delete(id, user);
  }
}
