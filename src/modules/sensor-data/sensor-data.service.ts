import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { SensorDataDTO } from './dto/sensor-data.dto';
import { SensorData } from './sensor-data.entity';
import { Sensor } from '@/modules/sensor-management/sensor.entity';
import { Cache } from 'cache-manager';
import { Between } from 'typeorm';
import { DateTime } from '@/common/helper/DateTime';

@Injectable()
export class SensorDataService {
  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

  async saveNewData(sensorData: SensorDataDTO) {
    const { sensorId, condition, timestamp } = sensorData;

    const sensor = await Sensor.findOne({
      where: { id: sensorId },
      relations: ['sensorType'],
    });

    if (!condition) {
      sensor.condition = condition;
      await sensor.save();
      return;
    }

    const data = {
      location: sensor.location,
      ...sensorData.data,
    };

    await SensorData.insert({
      data: data as any,
      timestamp: timestamp,
      sensor: sensor,
      sensorType: sensor.sensorType,
    });

    // const newData = new SensorData();
    // newData.data = data;
    // newData.timestamp = timestamp;
    // newData.sensor = sensor;
    // newData.sensorType = sensor.sensorType;

    // await newData.save();
  }

  async dataSummary(
    sensorTypeId: string,
    summaryRange: 'weekly' | 'monthly' | 'yearly',
  ) {
    switch (summaryRange) {
      case 'weekly':
        return await this.getSummaryByWeekly(sensorTypeId);
      case 'monthly':
        return await this.getSummaryByMonthly(sensorTypeId);
      case 'yearly':
        return await this.getSummaryByYearly(sensorTypeId);
    }
  }

  async getSummaryByWeekly(sensorTypeId: string) {
    const to = new DateTime()
      .add(1, 'day')
      .set(0, 'hour')
      .set(0, 'minute')
      .set(0, 'second')
      .set(0, 'millisecond');

    const from = to.clone().subtract(1, 'week');

    const data = await SensorData.find({
      where: {
        sensorType: { id: sensorTypeId },
        timestamp: Between(from.time, to.time),
      },
    });

    if (data.length === 0) return null;

    const categories: string[] = [];

    const dataGroupedToDays: Array<Array<SensorData>> = Array(7)
      .fill([])
      .map((_, i) => {
        const dayFrom = from.clone().add(i, 'day');
        const dayTo = dayFrom.clone().add(1, 'day');
        categories.push(dayFrom.getDayName(dayTo.time === to.time));
        return data.filter(
          (e) => e.timestamp >= dayFrom.time && e.timestamp < dayTo.time,
        );
      });

    const dataKeys = Object.keys(data[0].data);

    const dataAveragedInDay = dataGroupedToDays.map((day) => {
      const grouped = {};

      dataKeys.forEach((key) => {
        grouped[key] =
          day.map((e) => e.data[key]).reduce((a, b) => a + b, 0) / day.length;
      });

      return grouped;
    });

    const res = {};

    dataKeys.forEach((key) => {
      res[key] = dataAveragedInDay.map((e) => e[key] || 0);
    });

    res['categories'] = categories;

    return res;
  }

  async getSummaryByMonthly(sensorTypeId: string) {
    const to = new DateTime()
      .add(1, 'day')
      .set(0, 'hour')
      .set(0, 'minute')
      .set(0, 'second')
      .set(0, 'millisecond');

    const from = to.clone().subtract(4, 'week');

    const data = await SensorData.find({
      where: {
        sensorType: { id: sensorTypeId },
        timestamp: Between(from.time, to.time),
      },
    });

    if (data.length === 0) return null;

    const categories: string[] = [];

    const dataGroupedToDays: Array<Array<SensorData>> = Array(4)
      .fill([])
      .map((_, i) => {
        const dayFrom = from.clone().add(i, 'week');
        const dayTo = dayFrom.clone().add(1, 'week');
        categories.push(`Week ${i}`);
        return data.filter(
          (e) => e.timestamp >= dayFrom.time && e.timestamp < dayTo.time,
        );
      });

    const dataKeys = Object.keys(data[0].data);

    const dataAveragedInDay = dataGroupedToDays.map((day) => {
      const grouped = {};

      dataKeys.forEach((key) => {
        grouped[key] =
          day.map((e) => e.data[key]).reduce((a, b) => a + b, 0) / day.length;
      });

      return grouped;
    });

    const res = {};

    dataKeys.forEach((key) => {
      res[key] = dataAveragedInDay.map((e) => e[key] || 0);
    });

    res['categories'] = categories;

    return res;
  }

  async getSummaryByYearly(sensorTypeId: string) {
    const to = new DateTime()
      .add(1, 'day')
      .set(0, 'hour')
      .set(0, 'minute')
      .set(0, 'second')
      .set(0, 'millisecond');

    const from = to.clone().subtract(1, 'year');

    const data = await SensorData.find({
      where: {
        sensorType: { id: sensorTypeId },
        timestamp: Between(from.time, to.time),
      },
    });

    if (data.length === 0) return null;

    const categories: string[] = [];

    const dataGroupedToDays: Array<Array<SensorData>> = Array(12)
      .fill([])
      .map((_, i) => {
        const dayFrom = from.clone().add(i, 'month');
        const dayTo = dayFrom.clone().add(1, 'month');
        categories.push(dayFrom.format('MMMM'));
        return data.filter(
          (e) => e.timestamp >= dayFrom.time && e.timestamp < dayTo.time,
        );
      });

    const dataKeys = Object.keys(data[0].data);

    const dataAveragedInDay = dataGroupedToDays.map((day) => {
      const grouped = {};

      dataKeys.forEach((key) => {
        grouped[key] =
          day.map((e) => e.data[key]).reduce((a, b) => a + b, 0) / day.length;
      });

      return grouped;
    });

    const res = {};

    dataKeys.forEach((key) => {
      res[key] = dataAveragedInDay.map((e) => e[key] || 0);
    });

    res['categories'] = categories;

    return res;
  }

  async getDataList(sensorTypeId: string, from: number, to: number) {
    const dataList = await SensorData.findBy({
      sensorType: { id: sensorTypeId },
      timestamp: Between(from, to),
    });
    return dataList.map(({ timestamp, data }) => ({ timestamp, data }));
  }
}
