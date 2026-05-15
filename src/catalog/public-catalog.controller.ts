import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { RecordClickDto } from './dto/record-click.dto';

@Controller('public')
export class PublicCatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('catalog')
  getCatalog() {
    return this.catalogService.getPublicCatalog();
  }

  @Post('feedbacks')
  createFeedback(@Body() dto: CreateFeedbackDto) {
    return this.catalogService.createFeedback(dto);
  }

  @Post('clicks')
  recordClick(@Body() dto: RecordClickDto) {
    return this.catalogService.recordClick(dto);
  }
}
