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
import { ReadyMadeItem } from './ready-made-item.entity';
import { TowelType } from './towel-type.entity';

@Entity('towel_models')
export class TowelModel extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @Column({ default: 0 })
  clickCount: number;

  @ManyToOne(() => TowelType, (towelType) => towelType.models, {
    onDelete: 'CASCADE',
  })
  towelType: TowelType;

  @ManyToMany(() => ColorOption, (color) => color.towelModels, {
    cascade: false,
  })
  @JoinTable()
  availableColors: ColorOption[];

  @OneToMany(() => ReadyMadeItem, (readyMadeItem) => readyMadeItem.towelModel)
  readyMadeItems: ReadyMadeItem[];
}
