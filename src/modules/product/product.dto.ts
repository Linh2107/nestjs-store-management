import {
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as santizeHtml from 'sanitize-html';
export class ProductDto {
  @IsNotEmpty()
  @Length(5, 255)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  amount: number;

  @IsNotEmpty()
  @Transform(({ value }) => santizeHtml(value))
  content: string;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  storeId: number;

  @IsOptional()
  @IsString()
  displayImage: string;
}

export class ProductImageDto {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsInt()
  productId: number;
}

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  minPrice: number;

  @IsOptional()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxPrice: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit: number;
}
