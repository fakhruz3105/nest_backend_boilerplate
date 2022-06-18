import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AppEntity } from '@/common/model/app.entity';
import { Sensor } from '@/modules/sensor-management/sensor.entity';
import { SensorType } from '../sensor-management/sensor-type.entity';
import { bigint } from '@/common/helper/common.function';

@Entity()
export class SensorData extends AppEntity {
  @ManyToOne(() => Sensor, (sensor) => sensor.dataList)
  @JoinColumn({ name: 'sensorId' })
  public sensor: Sensor;

  @ManyToOne(() => SensorType, (sensorType) => sensorType.dataList)
  @JoinColumn({ name: 'sensorTypeId' })
  public sensorType: SensorType;

  @Column({ type: 'bigint', transformer: [bigint] })
  public timestamp: number;

  @Column({ type: 'json' })
  public data: Record<string, any>;
}
