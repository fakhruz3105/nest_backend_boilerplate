import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateUserDTO } from './user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  async getUser(id: string): Promise<User> {
    return await User.findOneBy({ id });
  }

  async createUser(body: CreateUserDTO): Promise<User> {
    const user: User = new User();

    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    return await user.save();
  }

  async onApplicationBootstrap() {
    await this.generateSuperUser();
  }

  private async generateSuperUser() {
    const user = await User.findOneBy({ email: 'superadmin@dev.com' });

    if (!user) {
      const user = new User();
      user.name = 'Super Admin';
      user.email = 'superadmin@dev.com';
      user.password = 'P@ssw0rd!';
      user.role = UserRole.SUPER_ADMIN;

      await User.upsert([user], {
        conflictPaths: ['email'],
        skipUpdateIfNoValuesChanged: true,
      });
    }
  }
}
