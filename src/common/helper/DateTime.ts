import dayjs, { ManipulateType, UnitTypeLong } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';

const padStart = function padStart(string, length, pad) {
  const s = String(string);
  if (!s || s.length >= length) return string;
  return '' + Array(length + 1 - s.length).join(pad) + string;
};

const padZoneStr = function padZoneStr(instance) {
  const negMinutes = -instance.utcOffset();
  const minutes = Math.abs(negMinutes);
  const hourOffset = Math.floor(minutes / 60);
  const minuteOffset = minutes % 60;
  return (
    '' +
    (negMinutes <= 0 ? '+' : '-') +
    padStart(hourOffset, 2, '0') +
    ':' +
    padStart(minuteOffset, 2, '0')
  );
};

const Utils = {
  s: padStart,
  z: padZoneStr,
};

const C = {
  REGEX_FORMAT:
    /\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
  INVALID_DATE_STRING: 'Invalid Date',
  FORMAT_DEFAULT: 'YYYY-MM-DDTHH:mm:ssZ',
};

export function format(formatStr) {
  if (!this.isValid()) return C.INVALID_DATE_STRING;

  const str = formatStr || C.FORMAT_DEFAULT;
  const zoneStr = Utils.z(this);
  const locale = this.$locale();
  const { $H, $m, $M } = this;
  const { weekdays, months, meridiem } = locale;
  const getShort = (arr, index, full?, length?) =>
    (arr && (arr[index] || arr(this, str))) || full[index].substr(0, length);
  const get$H = (num) => Utils.s($H % 12 || 12, num, '0');

  const meridiemFunc =
    meridiem ||
    ((hour, minute, isLowercase) => {
      const m = hour < 12 ? 'AM' : 'PM';
      return isLowercase ? m.toLowerCase() : m;
    });

  const matches = {
    YY: String(this.$y).slice(-2),
    YYYY: String(this.$y).padStart(4, '0'), // override this
    M: $M + 1,
    MM: Utils.s($M + 1, 2, '0'),
    MMM: getShort(locale.monthsShort, $M, months, 3),
    MMMM: getShort(months, $M),
    D: this.$D,
    DD: Utils.s(this.$D, 2, '0'),
    d: String(this.$W),
    dd: getShort(locale.weekdaysMin, this.$W, weekdays, 2),
    ddd: getShort(locale.weekdaysShort, this.$W, weekdays, 3),
    dddd: weekdays[this.$W],
    H: String($H),
    HH: Utils.s($H, 2, '0'),
    h: get$H(1),
    hh: get$H(2),
    a: meridiemFunc($H, $m, true),
    A: meridiemFunc($H, $m, false),
    m: String($m),
    mm: Utils.s($m, 2, '0'),
    s: String(this.$s),
    ss: Utils.s(this.$s, 2, '0'),
    SSS: Utils.s(this.$ms, 3, '0'),
    Z: zoneStr, // 'ZZ' logic below
  };

  return str.replace(
    C.REGEX_FORMAT,
    (match, $1) => $1 || matches[match] || zoneStr.replace(':', ''),
  ); // 'ZZ'
}

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
    dayjs.prototype.format = format;
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
}
