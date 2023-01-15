import { IsNotEmpty, Length, IsOptional, IsString } from 'class-validator';

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
