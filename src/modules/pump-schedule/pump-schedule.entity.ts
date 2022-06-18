import { Entity, Column } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';

@Entity()
export class PumpSchedule extends AppEntity {
  @Column({ type: 'varchar', length: 60 })
  public time: string;

  @Column({ type: 'boolean', default: false })
  public repeatDaily: boolean;
}
