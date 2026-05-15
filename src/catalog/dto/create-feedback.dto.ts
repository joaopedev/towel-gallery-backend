import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  readyMadeItemId: string;

  @IsString()
  authorName: string;

  @IsString()
  message: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
