import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { SensorData } from '../sensor-data/sensor-data.entity';
import { SensorType } from './sensor-type.entity';

@Entity()
export class Sensor extends AppEntity {
  @Column({ type: 'json' })
  public location: { latitude: number; longitude: number };

  @Column({ type: 'boolean', default: true })
  public condition: boolean;

  @ManyToOne(() => SensorType, (sensorType) => sensorType.sensorList)
  public sensorType: SensorType;

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensor)
  public dataList: SensorData[];
}
