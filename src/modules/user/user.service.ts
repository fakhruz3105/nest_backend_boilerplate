import { DateTime } from '@/common/helper/DateTime';
import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  async getUser(id: string): Promise<User> {
    return await User.findOneBy({ id });
  }

  async getAllUsers() {
    return (await User.find()).map((user) => user.toJSON());
  }

  async getUserDetails(id: string) {
    return await User.findOneBy({ id });
  }

  async createUser(body: CreateUserDTO): Promise<User> {
    const user: User = new User();

    user.name = body.name;
    user.email = body.email;
    user.password = body.password;

    return await user.save();
  }

  async updateUser(
    requestingUser: User,
    updateDetails: UpdateUserDTO,
  ): Promise<User> {
    if (
      requestingUser.role !== UserRole.SUPER_ADMIN &&
      requestingUser.id !== updateDetails.id
    ) {
      throw new UnauthorizedException();
    }

    const { name, email, password } = updateDetails;

    const userToBeUpdated = await User.findOneBy({ id: updateDetails.id });

    if (name) userToBeUpdated.name = name;
    if (email) userToBeUpdated.email = email;
    if (password) userToBeUpdated.name = password;

    return await userToBeUpdated.save();
  }

  async deleteUser(requestingUser: User, userId: string): Promise<User> {
    if (requestingUser.id === userId) {
      throw new BadRequestException('Unable to delete self');
    }

    const user = await User.findOneBy({ id: userId });
    return await user.remove();
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
