import dayjs, { type ManipulateType, type UnitTypeLong } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';

const day = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export class DateTime {
  private _time: number;
  private timezone: string;

  private get timeInServiceFormat() {
    return dayjs(this._time).tz(this.timezone);
  }

  get time() {
    return this._time;
  }

  constructor(_date?: string | number | Date | bigint, timezone?: string) {
    const date = typeof _date === 'bigint' ? Number(_date) : _date;

    this.timezone = timezone || 'Asia/Singapore';

    this.initService();

    if (!date) {
      this._time = dayjs().tz(this.timezone).valueOf();
      return;
    }

    const res = dayjs(date).tz(this.timezone).valueOf();
    if (!res) throw new Error('Invalid Date');
    this._time = res;
  }

  private initService() {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    dayjs.extend(timezonePlugin);
  }

  format(format: string): string {
    return this.timeInServiceFormat.format(format);
  }

  add(amount: number, timeUnit: ManipulateType) {
    this._time = this.timeInServiceFormat.add(amount, timeUnit).valueOf();
    return this;
  }

  subtract(amount: number, timeUnit: ManipulateType) {
    this._time = this.timeInServiceFormat.subtract(amount, timeUnit).valueOf();
    return this;
  }

  get(timeUnit: Exclude<UnitTypeLong, 'week'>) {
    return this.timeInServiceFormat.get(timeUnit);
  }

  set(value: number, timeUnit: Exclude<UnitTypeLong, 'week'>) {
    this._time = this.timeInServiceFormat.set(timeUnit, value).valueOf();
    return this;
  }

  difference(
    date: DateTime,
    timeUnit: UnitTypeLong = 'millisecond',
    floatingValue = true,
  ) {
    return this.timeInServiceFormat.diff(
      date.timeInServiceFormat,
      timeUnit,
      floatingValue,
    );
  }

  toDate(): Date {
    return this.timeInServiceFormat.toDate();
  }

  clone() {
    return new DateTime(this._time, this.timezone);
  }

  setTimezone(timezone: string) {
    this.timezone = timezone;
    return this;
  }

  getDayName(markAsToday = false) {
    let name = day[this.get('day')];
    if (markAsToday) name += ' (Today)';
    return name;
  }
}
