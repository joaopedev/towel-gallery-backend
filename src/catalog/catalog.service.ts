import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClickTarget } from '../common/enums/click-target.enum';
import { CreateColorOptionDto } from './dto/create-color-option.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateLetterStyleDto } from './dto/create-letter-style.dto';
import { CreateReadyMadeItemDto } from './dto/create-ready-made-item.dto';
import { CreateTowelModelDto } from './dto/create-towel-model.dto';
import { CreateTowelTypeDto } from './dto/create-towel-type.dto';
import { ModerateFeedbackDto } from './dto/moderate-feedback.dto';
import { RecordClickDto } from './dto/record-click.dto';
import { ColorOption } from './entities/color-option.entity';
import { Feedback } from './entities/feedback.entity';
import { LetterStyle } from './entities/letter-style.entity';
import { ReadyMadeItem } from './entities/ready-made-item.entity';
import { TowelModel } from './entities/towel-model.entity';
import { TowelType } from './entities/towel-type.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(LetterStyle)
    private readonly letterStylesRepository: Repository<LetterStyle>,
    @InjectRepository(ColorOption)
    private readonly colorOptionsRepository: Repository<ColorOption>,
    @InjectRepository(TowelType)
    private readonly towelTypesRepository: Repository<TowelType>,
    @InjectRepository(TowelModel)
    private readonly towelModelsRepository: Repository<TowelModel>,
    @InjectRepository(ReadyMadeItem)
    private readonly readyMadeItemsRepository: Repository<ReadyMadeItem>,
    @InjectRepository(Feedback)
    private readonly feedbacksRepository: Repository<Feedback>,
    private readonly configService: ConfigService,
  ) {}

  private async findColorOptions(colorIds: string[]) {
    const colors = await this.colorOptionsRepository.find({
      where: { id: In(colorIds) },
    });

    if (colors.length !== colorIds.length) {
      throw new NotFoundException('Uma ou mais cores não foram encontradas.');
    }

    return colors;
  }

  async getPublicCatalog() {
    const [letterStyles, towelTypes, towelModels, readyMadeItems] =
      await Promise.all([
        this.letterStylesRepository.find({
          order: { clickCount: 'DESC', createdAt: 'DESC' },
        }),
        this.towelTypesRepository.find({
          relations: { availableColors: true },
          order: { clickCount: 'DESC', createdAt: 'DESC' },
        }),
        this.towelModelsRepository.find({
          relations: { towelType: true, availableColors: true },
          order: { clickCount: 'DESC', createdAt: 'DESC' },
        }),
        this.readyMadeItemsRepository.find({
          relations: {
            towelType: true,
            towelModel: true,
            letterStyle: true,
            colors: true,
            feedbacks: true,
          },
          order: { createdAt: 'DESC' },
        }),
      ]);

    return {
      whatsappNumber:
        this.configService.get<string>('WHATSAPP_NUMBER') ?? '5511999999999',
      letterStyles,
      towelTypes,
      towelModels,
      readyMadeItems: readyMadeItems.map((item) => ({
        ...item,
        feedbacks: item.feedbacks.filter((feedback) => feedback.approved),
      })),
    };
  }

  async createLetterStyle(dto: CreateLetterStyleDto) {
    const letterStyle = this.letterStylesRepository.create({
      name: dto.name,
      description: dto.description ?? '',
      previewText: dto.previewText ?? 'Maria',
      imageUrl: dto.imageUrl,
      accentColor: dto.accentColor ?? '#8c4b5a',
    });

    return this.letterStylesRepository.save(letterStyle);
  }

  async createColorOption(dto: CreateColorOptionDto) {
    const color = this.colorOptionsRepository.create(dto);
    return this.colorOptionsRepository.save(color);
  }

  async createTowelType(dto: CreateTowelTypeDto) {
    const availableColors = await this.findColorOptions(dto.colorIds);
    const towelType = this.towelTypesRepository.create({
      name: dto.name,
      description: dto.description ?? '',
      imageUrl: dto.imageUrl,
      availableColors,
    });

    return this.towelTypesRepository.save(towelType);
  }

  async createTowelModel(dto: CreateTowelModelDto) {
    const towelType = await this.towelTypesRepository.findOne({
      where: { id: dto.towelTypeId },
    });

    if (!towelType) {
      throw new NotFoundException('Tipo de toalha não encontrado.');
    }

    const availableColors = await this.findColorOptions(dto.colorIds);
    const towelModel = this.towelModelsRepository.create({
      name: dto.name,
      description: dto.description ?? '',
      imageUrl: dto.imageUrl,
      towelType,
      availableColors,
    });

    return this.towelModelsRepository.save(towelModel);
  }

  async createReadyMadeItem(dto: CreateReadyMadeItemDto) {
    const towelType = await this.towelTypesRepository.findOne({
      where: { id: dto.towelTypeId },
    });

    if (!towelType) {
      throw new NotFoundException('Tipo de toalha não encontrado.');
    }

    const [towelModel, letterStyle, colors] = await Promise.all([
      dto.towelModelId
        ? this.towelModelsRepository.findOne({
            where: { id: dto.towelModelId },
          })
        : Promise.resolve(null),
      dto.letterStyleId
        ? this.letterStylesRepository.findOne({
            where: { id: dto.letterStyleId },
          })
        : Promise.resolve(null),
      this.findColorOptions(dto.colorIds),
    ]);

    if (dto.towelModelId && !towelModel) {
      throw new NotFoundException('Modelo de toalha não encontrado.');
    }

    if (dto.letterStyleId && !letterStyle) {
      throw new NotFoundException('Estilo de letra não encontrado.');
    }

    const readyMadeItem = this.readyMadeItemsRepository.create({
      title: dto.title,
      description: dto.description ?? '',
      imageUrl: dto.imageUrl,
      priceLabel: dto.priceLabel ?? '',
      towelType,
      towelModel,
      letterStyle,
      colors,
    });

    return this.readyMadeItemsRepository.save(readyMadeItem);
  }

  async createFeedback(dto: CreateFeedbackDto) {
    const readyMadeItem = await this.readyMadeItemsRepository.findOne({
      where: { id: dto.readyMadeItemId },
    });

    if (!readyMadeItem) {
      throw new NotFoundException('Peça pronta não encontrada.');
    }

    const feedback = this.feedbacksRepository.create({
      authorName: dto.authorName,
      message: dto.message,
      rating: dto.rating,
      approved: false,
      readyMadeItem,
    });

    return this.feedbacksRepository.save(feedback);
  }

  async recordClick(dto: RecordClickDto) {
    switch (dto.targetType) {
      case ClickTarget.LETTER_STYLE:
        await this.letterStylesRepository.increment(
          { id: dto.targetId },
          'clickCount',
          1,
        );
        break;
      case ClickTarget.TOWEL_TYPE:
        await this.towelTypesRepository.increment(
          { id: dto.targetId },
          'clickCount',
          1,
        );
        break;
      case ClickTarget.TOWEL_MODEL:
        await this.towelModelsRepository.increment(
          { id: dto.targetId },
          'clickCount',
          1,
        );
        break;
    }

    return { ok: true };
  }

  async getAdminCatalog() {
    const [publicCatalog, colorOptions, feedbacks] = await Promise.all([
      this.getPublicCatalog(),
      this.colorOptionsRepository.find({
        order: { createdAt: 'DESC' },
      }),
      this.feedbacksRepository.find({
        relations: { readyMadeItem: true },
        order: { createdAt: 'DESC' },
      }),
    ]);

    return {
      ...publicCatalog,
      colorOptions,
      feedbacks,
    };
  }

  async getPendingFeedbacks() {
    return this.feedbacksRepository.find({
      where: { approved: false },
      relations: { readyMadeItem: true },
      order: { createdAt: 'DESC' },
    });
  }

  async moderateFeedback(id: string, dto: ModerateFeedbackDto) {
    const feedback = await this.feedbacksRepository.findOne({ where: { id } });

    if (!feedback) {
      throw new NotFoundException('Feedback não encontrado.');
    }

    feedback.approved = dto.approved;
    return this.feedbacksRepository.save(feedback);
  }

  async getStatsOverview() {
    const [topLetters, topTowelTypes, topTowelModels, pendingFeedbacks] =
      await Promise.all([
        this.letterStylesRepository.find({
          take: 5,
          order: { clickCount: 'DESC' },
        }),
        this.towelTypesRepository.find({
          take: 5,
          order: { clickCount: 'DESC' },
        }),
        this.towelModelsRepository.find({
          take: 5,
          relations: { towelType: true },
          order: { clickCount: 'DESC' },
        }),
        this.feedbacksRepository.count({ where: { approved: false } }),
      ]);

    return {
      topLetters,
      topTowelTypes,
      topTowelModels,
      pendingFeedbacks,
    };
  }

  async removeLetterStyle(id: string) {
    await this.letterStylesRepository.delete(id);
    return { ok: true };
  }

  async removeColorOption(id: string) {
    await this.colorOptionsRepository.delete(id);
    return { ok: true };
  }

  async removeTowelType(id: string) {
    await this.towelTypesRepository.delete(id);
    return { ok: true };
  }

  async removeTowelModel(id: string) {
    await this.towelModelsRepository.delete(id);
    return { ok: true };
  }

  async removeReadyMadeItem(id: string) {
    await this.readyMadeItemsRepository.delete(id);
    return { ok: true };
  }
}
