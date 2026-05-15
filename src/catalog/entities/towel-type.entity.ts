import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ColorOption } from './color-option.entity';
import { ReadyMadeItem } from './ready-made-item.entity';
import { TowelModel } from './towel-model.entity';

@Entity('towel_types')
export class TowelType extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @Column({ default: 0 })
  clickCount: number;

  @ManyToMany(() => ColorOption, (color) => color.towelTypes, {
    cascade: false,
  })
  @JoinTable()
  availableColors: ColorOption[];

  @OneToMany(() => TowelModel, (towelModel) => towelModel.towelType)
  models: TowelModel[];

  @OneToMany(() => ReadyMadeItem, (readyMadeItem) => readyMadeItem.towelType)
  readyMadeItems: ReadyMadeItem[];
}
