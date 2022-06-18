import { AppEntity } from '@/common/model/app.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AuthSession extends AppEntity {
  @Column({ type: 'uuid' })
  public userId: string;
}
