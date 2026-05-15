import { IsEnum, IsString } from 'class-validator';
import { ClickTarget } from '../../common/enums/click-target.enum';

export class RecordClickDto {
  @IsEnum(ClickTarget)
  targetType: ClickTarget;

  @IsString()
  targetId: string;
}
