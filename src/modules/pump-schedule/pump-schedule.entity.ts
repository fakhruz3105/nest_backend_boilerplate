import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { User } from '../user/user.entity';

@Entity()
export class PumpSchedule extends AppEntity {
  @Column({ type: 'varchar', length: 60 })
  public time: string;

  @Column({ type: 'boolean', default: false })
  public repeatDaily: boolean;

  @ManyToOne(() => User, (user) => user.sensorList)
  public setter: User;
}
