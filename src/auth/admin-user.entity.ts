import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('admin_users')
export class AdminUser extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;
}
