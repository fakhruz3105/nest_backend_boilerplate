import { Entity, Column, OneToMany } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { SensorData } from '../sensor-data/sensor-data.entity';

@Entity()
export class Sensor extends AppEntity {
  @Column({ type: 'varchar', length: 120 })
  public category: string;

  @Column('simple-array')
  public dataCollected: string[];

  @Column({ type: 'boolean', default: true })
  public condition: boolean;

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensorId)
  public dataList: SensorData[];
}
