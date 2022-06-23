import { Entity, Column, OneToMany } from 'typeorm';
import bcrypt from 'bcrypt';
import { instanceToPlain, Exclude } from 'class-transformer';
import { AppEntity } from 'src/common/model/app.entity';
import { BadRequestException } from '@nestjs/common';
import { Sensor } from '../sensor-management/sensor.entity';
import { PumpSchedule } from '../pump-schedule/pump-schedule.entity';

export enum UserRole {
  SUPER_ADMIN,
  ADMIN,
}

@Entity()
export class User extends AppEntity {
  @Column({ type: 'varchar', length: 120 })
  public name: string;

  @Column({ unique: true, type: 'varchar', length: 120 })
  public email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 120, default: '' })
  public password: string;

  @Column({ type: 'boolean', default: false })
  public verified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @OneToMany(() => Sensor, (sensor) => sensor.id)
  public sensorList: Sensor[];

  @OneToMany(() => PumpSchedule, (schedule) => schedule.id)
  public scheduleList: PumpSchedule[];

  toJSON() {
    return instanceToPlain(this);
  }

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  static async verifyUser(
    email: string,
    password: string,
  ): Promise<User> | null {
    const user = await User.findOneBy({ email });
    if (!user) return null;
    if (!user.verified)
      throw new BadRequestException(
        'Please verify your account. Check your email',
      );

    return user.verifyPassword(password) ? user : null;
  }
}
