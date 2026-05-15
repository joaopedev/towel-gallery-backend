import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateReadyMadeItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  priceLabel?: string;

  @IsString()
  towelTypeId: string;

  @IsOptional()
  @IsString()
  towelModelId?: string;

  @IsOptional()
  @IsString()
  letterStyleId?: string;

  @IsArray()
  @ArrayNotEmpty()
  colorIds: string[];
}
