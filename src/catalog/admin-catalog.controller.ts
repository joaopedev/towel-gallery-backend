import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CatalogService } from './catalog.service';
import { CreateColorOptionDto } from './dto/create-color-option.dto';
import { CreateLetterStyleDto } from './dto/create-letter-style.dto';
import { CreateReadyMadeItemDto } from './dto/create-ready-made-item.dto';
import { CreateTowelModelDto } from './dto/create-towel-model.dto';
import { CreateTowelTypeDto } from './dto/create-towel-type.dto';
import { ModerateFeedbackDto } from './dto/moderate-feedback.dto';

@Controller('admin/catalog')
@UseGuards(JwtAuthGuard)
export class AdminCatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getCatalog() {
    return this.catalogService.getAdminCatalog();
  }

  @Get('stats')
  getStats() {
    return this.catalogService.getStatsOverview();
  }

  @Get('feedbacks/pending')
  getPendingFeedbacks() {
    return this.catalogService.getPendingFeedbacks();
  }

  @Patch('feedbacks/:id')
  moderateFeedback(@Param('id') id: string, @Body() dto: ModerateFeedbackDto) {
    return this.catalogService.moderateFeedback(id, dto);
  }

  @Post('letters')
  createLetterStyle(@Body() dto: CreateLetterStyleDto) {
    return this.catalogService.createLetterStyle(dto);
  }

  @Delete('letters/:id')
  removeLetterStyle(@Param('id') id: string) {
    return this.catalogService.removeLetterStyle(id);
  }

  @Post('colors')
  createColor(@Body() dto: CreateColorOptionDto) {
    return this.catalogService.createColorOption(dto);
  }

  @Delete('colors/:id')
  removeColor(@Param('id') id: string) {
    return this.catalogService.removeColorOption(id);
  }

  @Post('towel-types')
  createTowelType(@Body() dto: CreateTowelTypeDto) {
    return this.catalogService.createTowelType(dto);
  }

  @Delete('towel-types/:id')
  removeTowelType(@Param('id') id: string) {
    return this.catalogService.removeTowelType(id);
  }

  @Post('towel-models')
  createTowelModel(@Body() dto: CreateTowelModelDto) {
    return this.catalogService.createTowelModel(dto);
  }

  @Delete('towel-models/:id')
  removeTowelModel(@Param('id') id: string) {
    return this.catalogService.removeTowelModel(id);
  }

  @Post('ready-made-items')
  createReadyMadeItem(@Body() dto: CreateReadyMadeItemDto) {
    return this.catalogService.createReadyMadeItem(dto);
  }

  @Delete('ready-made-items/:id')
  removeReadyMadeItem(@Param('id') id: string) {
    return this.catalogService.removeReadyMadeItem(id);
  }
}
