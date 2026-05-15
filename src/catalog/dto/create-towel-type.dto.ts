import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTowelTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  colorIds: string[];
}
