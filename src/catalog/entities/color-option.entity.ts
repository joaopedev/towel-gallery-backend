import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ReadyMadeItem } from './ready-made-item.entity';
import { TowelModel } from './towel-model.entity';
import { TowelType } from './towel-type.entity';

@Entity('color_options')
export class ColorOption extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  hexCode: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @ManyToMany(() => TowelType, (towelType) => towelType.availableColors)
  towelTypes: TowelType[];

  @ManyToMany(() => TowelModel, (towelModel) => towelModel.availableColors)
  towelModels: TowelModel[];

  @ManyToMany(() => ReadyMadeItem, (readyMadeItem) => readyMadeItem.colors)
  readyMadeItems: ReadyMadeItem[];
}
