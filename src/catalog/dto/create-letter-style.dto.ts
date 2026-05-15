import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class CreateLetterStyleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  previewText?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsHexColor()
  accentColor?: string;
}
