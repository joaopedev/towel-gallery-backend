import { IsBoolean } from 'class-validator';

export class ModerateFeedbackDto {
  @IsBoolean()
  approved: boolean;
}
