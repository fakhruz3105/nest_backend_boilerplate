import { Injectable } from '@nestjs/common';
import { SensorDataDTO } from './dto/sensor-data.dto';
import { SensorData } from './sensor-data.entity';
import { Sensor } from '@/modules/sensor-management/sensor.entity';

@Injectable()
export class SensorService {
  async saveNewData(data: SensorDataDTO) {
    const { sensorId, condition } = data;

    const sensor = await Sensor.findOne({ where: { id: sensorId } });

    if (!condition) {
      sensor.condition = condition;
      await sensor.save();
      return;
    }

    await SensorData.create({
      sensorId,
      data: data.data,
    });
  }
}
