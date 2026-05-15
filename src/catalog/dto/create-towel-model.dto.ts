import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTowelModelDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  towelTypeId: string;

  @IsArray()
  @ArrayNotEmpty()
  colorIds: string[];
}
