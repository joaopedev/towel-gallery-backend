import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ReadyMadeItem } from './ready-made-item.entity';

@Entity('feedbacks')
export class Feedback extends BaseEntity {
  @Column()
  authorName: string;

  @Column()
  message: string;

  @Column({ default: false })
  approved: boolean;

  @Column({ default: 5 })
  rating: number;

  @ManyToOne(() => ReadyMadeItem, (readyMadeItem) => readyMadeItem.feedbacks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'readyMadeItemId' })
  readyMadeItem: ReadyMadeItem;
}
