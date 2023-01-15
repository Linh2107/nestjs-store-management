import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { multerOptions } from 'src/utils/file-upload';
import { JwtAuthGuard } from '../auth/jwt-auth.stategy';
import { User } from '../user/user.entity';
import { ProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Req() req: any) {
    return this.service.findAll(req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async detail(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return this.service.findOne({ id, store: { userId: user.id } }, [
      'store',
      'images',
    ]);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'displayImage' }, { name: 'images' }],
      multerOptions,
    ),
  )
  async create(
    @Body() dto: ProductDto,
    @AuthUser() user: User,
    @UploadedFiles()
    files: {
      displayImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.service.create(dto, files, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'displayImage', maxCount: 1 }, { name: 'images' }],
      multerOptions,
    ),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductDto,
    @UploadedFiles()
    files: {
      displayImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @AuthUser() user: User,
  ) {
    return this.service.update(id, dto, files, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @AuthUser() user: User) {
    return this.service.delete(id, user);
  }
}
