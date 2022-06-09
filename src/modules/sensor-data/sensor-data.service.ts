import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { SensorDataDTO } from './dto/sensor-data.dto';
import { SensorData } from './sensor-data.entity';
import { Sensor } from '@/modules/sensor-management/sensor.entity';
import { Cache } from 'cache-manager';
import { Between } from 'typeorm';

@Injectable()
export class SensorService {
  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

  async saveNewData(sensorData: SensorDataDTO) {
    const { sensorId, condition, timestamp } = sensorData;

    const sensor = await Sensor.findOne({ where: { id: sensorId } });

    if (!condition) {
      sensor.condition = condition;
      await sensor.save();
      return;
    }

    const data = {
      location: sensor.location,
      ...sensorData.data,
    };

    await SensorData.create({
      sensor,
      timestamp,
      data,
    });
  }

  async dataSummary(
    sensorTypeId: string,
    startTimestamp: number,
    endTimestamp: number,
  ) {
    return await SensorData.find({
      where: {
        sensorType: { id: sensorTypeId },
        timestamp: Between(startTimestamp, endTimestamp),
      },
    });
  }
}
