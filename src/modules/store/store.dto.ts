import {
  IsNotEmpty,
  Length,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class StoreDto {
  @IsNotEmpty()
  @Length(5, 255)
  name: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  address: string;

  @IsOptional()
  description: string;
}

export class StoreFilterDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit: number;
}
