import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { Sensor } from '@/modules/sensor-management/sensor.entity';

@Entity()
export class SensorData extends AppEntity {
  @ManyToOne(() => Sensor, (sensor) => sensor.dataList)
  @JoinColumn({ name: 'sensorId' })
  public sensorId: string;

  @Column('simple-json')
  public data: Record<string, any>;
}
