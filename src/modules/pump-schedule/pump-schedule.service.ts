import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { NewPumpScheduleDTO } from './dto/new-pump-schedule.dto';
import { PumpSchedule } from './pump-schedule.entity';
import { UpdatePumpScheduleDTO } from './dto/update-pump-schedule.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DateTime } from '@/common/helper/DateTime';
import { Config } from '@/common/model/config.entity';
import { GET, POST } from '@/common/helper/APICaller';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PumpScheduleService implements OnApplicationBootstrap {
  private logger = new Logger(PumpScheduleService.name);

  constructor(
    protected readonly scheduleRegistry: SchedulerRegistry,
    protected readonly configService: ConfigService,
  ) {}

  get piBaseUrl() {
    return this.configService.get<string>('PI_BASE_URL');
  }

  get piSecretKey() {
    return this.configService.get<string>('PI_SECRET_KEY');
  }

  async togglePump() {
    let state = await Config.findOneBy({ key: 'pumpState' });

    if (!state) {
      state = new Config();
      state.key = 'pumpState';
      state.value = { pumpOn: false, pumpStartTime: null };
    }

    if (state.value.pumpOn) {
      await GET(`${this.piBaseUrl}/api/smart/pump/off`, {
        headers: { 'pi-key': this.piSecretKey },
      });
      state.value.pumpOn = false;
      state.value.pumpStartTime = null;
    } else {
      await GET(`${this.piBaseUrl}/api/smart/pump/on`, {
        headers: { 'pi-key': this.piSecretKey },
      });
      state.value.pumpOn = true;
      state.value.pumpStartTime = new DateTime().time;
    }

    await state.save();
  }

  async getPumpState() {
    let state = await Config.findOneBy({ key: 'pumpState' });

    if (!state) {
      state = new Config();
      state.key = 'pumpState';
      state.value = { pumpOn: false, pumpStartTime: null };
      await state.save();
    }

    return state.value;
  }

  async onApplicationBootstrap() {
    await this.setupPumpSchedule();
  }

  async setupPumpSchedule() {
    const upcomingSchedules = await PumpSchedule.find();
    upcomingSchedules.forEach(({ id, time, repeatDaily }) => {
      const [hour, minute] = time.split(':');
      const cronTime = `0 ${minute} ${hour} * * *`;

      const newJob = new CronJob(
        cronTime,
        async () => {
          try {
            await POST(`${this.piBaseUrl}/api/smart/pump`, null, {
              headers: { 'pi-key': this.piSecretKey },
            });
          } catch (error) {
            this.logger.error(error.message);
          }

          if (!repeatDaily) {
            const job = this.scheduleRegistry.getCronJob(id);
            job.stop();

            const schedule = await PumpSchedule.findOneBy({ id });
            schedule.remove();
          }
        },
        null,
        false,
        'Asia/Singapore',
      );

      this.scheduleRegistry.addCronJob(id, newJob);
      newJob.start();
      this.logger.debug(`${id} - ${newJob.nextDate()}`);
    });
  }

  registerSchedule({ id, time, repeatDaily }: PumpSchedule) {
    try {
      this.scheduleRegistry.deleteCronJob(id);
    } catch (error) {
      this.logger.debug(error.message);
    }

    const [hour, minute] = time.split(':');
    const cronTime = `0 ${minute} ${hour} * * *`;

    const newJob = new CronJob(
      cronTime,
      async () => {
        try {
          await POST(`${this.piBaseUrl}/api/smart/pump`, null, {
            headers: { 'pi-key': this.piSecretKey },
          });
        } catch (error) {
          this.logger.error(error.message);
        }

        if (!repeatDaily) {
          const job = this.scheduleRegistry.getCronJob(id);
          job.stop();

          const schedule = await PumpSchedule.findOneBy({ id });
          schedule.remove();
        }
      },
      null,
      false,
      'Asia/Singapore',
    );

    this.scheduleRegistry.addCronJob(id, newJob);
    newJob.start();
    this.logger.debug(`${id} - ${newJob.nextDate()}`);
  }

  async listSchedule() {
    const list = await PumpSchedule.find();
    return list.map((e) => e.toJSON());
  }

  async newSchedule(schedule: NewPumpScheduleDTO) {
    const newSchedule = new PumpSchedule();
    newSchedule.time = schedule.time;
    newSchedule.repeatDaily = schedule.repeatDaily;
    await newSchedule.save();
    this.registerSchedule(newSchedule);
    return newSchedule.toJSON();
  }

  async updateSchedule(schedule: UpdatePumpScheduleDTO) {
    const updatedSchedule = await PumpSchedule.save({
      id: schedule.id,
      time: schedule.time,
      repeatDaily: schedule.repeatDaily,
    });
    this.registerSchedule(updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(id: string) {
    return await PumpSchedule.delete({ id });
  }
}
