import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ReadyMadeItem } from './ready-made-item.entity';

@Entity('letter_styles')
export class LetterStyle extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: 'Maria' })
  previewText: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @Column({ default: '#8c4b5a' })
  accentColor: string;

  @Column({ default: 0 })
  clickCount: number;

  @OneToMany(() => ReadyMadeItem, (readyMadeItem) => readyMadeItem.letterStyle)
  readyMadeItems: ReadyMadeItem[];
}
