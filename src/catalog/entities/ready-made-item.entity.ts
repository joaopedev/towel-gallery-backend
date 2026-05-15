import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ColorOption } from './color-option.entity';
import { Feedback } from './feedback.entity';
import { LetterStyle } from './letter-style.entity';
import { TowelModel } from './towel-model.entity';
import { TowelType } from './towel-type.entity';

@Entity('ready_made_items')
export class ReadyMadeItem extends BaseEntity {
  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ default: '' })
  priceLabel: string;

  @ManyToOne(() => TowelType, (towelType) => towelType.readyMadeItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  towelType: TowelType;

  @ManyToOne(() => TowelModel, (towelModel) => towelModel.readyMadeItems, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  towelModel?: TowelModel | null;

  @ManyToOne(() => LetterStyle, (letterStyle) => letterStyle.readyMadeItems, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  letterStyle?: LetterStyle | null;

  @ManyToMany(() => ColorOption, (color) => color.readyMadeItems, {
    cascade: false,
  })
  @JoinTable()
  colors: ColorOption[];

  @OneToMany(() => Feedback, (feedback) => feedback.readyMadeItem)
  feedbacks: Feedback[];
}
