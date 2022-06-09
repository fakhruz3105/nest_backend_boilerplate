import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcrypt';
import { instanceToPlain, Exclude } from 'class-transformer';
import { AppEntity } from 'src/common/model/app.entity';

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
  @Column({ type: 'varchar', length: 120 })
  public password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  toJSON() {
    return instanceToPlain(this);
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
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
    return user.verifyPassword(password) ? user : null;
  }
}
