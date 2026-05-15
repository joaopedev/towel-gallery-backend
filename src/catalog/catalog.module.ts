import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { AdminCatalogController } from './admin-catalog.controller';
import { PublicCatalogController } from './public-catalog.controller';
import { ColorOption } from './entities/color-option.entity';
import { Feedback } from './entities/feedback.entity';
import { LetterStyle } from './entities/letter-style.entity';
import { ReadyMadeItem } from './entities/ready-made-item.entity';
import { TowelModel } from './entities/towel-model.entity';
import { TowelType } from './entities/towel-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LetterStyle,
      ColorOption,
      TowelType,
      TowelModel,
      ReadyMadeItem,
      Feedback,
    ]),
  ],
  controllers: [PublicCatalogController, AdminCatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
