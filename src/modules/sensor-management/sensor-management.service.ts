import { Injectable } from '@nestjs/common';
import { NewSensorTypeDTO } from './dto/new-sensor-type.dto';
import { NewSensorDTO } from './dto/new-sensor.dto';
import { UpdateSensorDTO } from './dto/update-sensor.dto';
import { Sensor } from './sensor.entity';
import { SensorType } from './sensor-type.entity';
import { UpdateSensorTypeDTO } from './dto/update-sensor-type.dto';

@Injectable()
export class SensorManagementService {
  async listOfSensors() {
    return (await Sensor.find()).map((sensor) => sensor.toJSON());
  }

  async listOfSensorTypes() {
    return (await SensorType.find()).map((sensor) => sensor.toJSON());
  }

  async sensorDetails(id: string) {
    const sensor = await Sensor.findOne({
      relations: { dataList: true },
      where: { id },
    });

    return sensor.toJSON();
  }

  async sensorTypeDetails(id: string) {
    const sensorType = await SensorType.findOne({
      relations: { sensorList: true },
      where: { id },
    });

    return sensorType.toJSON();
  }

  async registerNewSensor(newSensor: NewSensorDTO) {
    return await Sensor.create({
      location: {
        latitude: newSensor.latitude,
        longitude: newSensor.longitude,
      },
      sensorType: { id: newSensor.sensorTypeId },
    });
  }

  async updateSensor(updateSensor: UpdateSensorDTO) {
    const sensor = await Sensor.findOneBy({ id: updateSensor.id });
    const location = sensor.location;

    const { latitude, longitude } = updateSensor;

    if (typeof latitude === 'number') location.latitude = latitude;
    if (typeof longitude === 'number') location.longitude = longitude;

    return await sensor.save();
  }

  async newSensorType(newSensorType: NewSensorTypeDTO) {
    return await SensorType.create({
      name: newSensorType.name,
      dataCollected: newSensorType.dataCollected,
      price: newSensorType.price,
    });
  }

  async updateSensorType(updateSensorType: UpdateSensorTypeDTO) {
    const sensorType = await SensorType.findOneBy({ id: updateSensorType.id });

    const { name, dataCollected, price } = updateSensorType;

    if (name) sensorType.name = name;
    if (dataCollected) sensorType.dataCollected = dataCollected;
    if (typeof price === 'number') sensorType.price = price;

    return await sensorType.save();
  }
}
