import { Entity, Column, OneToMany } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { Sensor } from './sensor.entity';
import { SensorData } from '../sensor-data/sensor-data.entity';

@Entity()
export class SensorType extends AppEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @Column('simple-array')
  public dataCollected: string[];

  @Column({ type: 'decimal', nullable: true })
  public price?: number;

  @OneToMany(() => Sensor, (sensor) => sensor.id)
  public sensorList: Sensor[];

  @OneToMany(() => SensorData, (sensorData) => sensorData.sensorType)
  public dataList: SensorData[];
}
