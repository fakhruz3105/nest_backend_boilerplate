import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  BaseEntity,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

export class AppEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  id: string;

  toJSON() {
    return instanceToPlain(this);
  }

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
