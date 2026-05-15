import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class CreateColorOptionDto {
  @IsString()
  name: string;

  @IsHexColor()
  hexCode: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
