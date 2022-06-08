import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { Sensor } from './sensor.entity';

@Entity()
export class SensorData extends AppEntity {
  @ManyToOne(() => Sensor, (sensor) => sensor.dataList)
  public sensorId: string;

  @Column('simple-json')
  public data: Record<string, any>;
}
