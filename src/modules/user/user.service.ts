import {
  BadRequestException,
  Injectable,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from '@/modules/notification/notification.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User, UserRole } from './user.entity';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  async getUser(id: string): Promise<User> {
    return await User.findOneBy({ id });
  }

  async getAllUsers() {
    return (await User.find()).map((user) => user.toJSON());
  }

  async getAllUsersSimple() {
    return (await User.find()).map(({ id, name }) => ({ id, name }));
  }

  async getUserDetails(id: string) {
    return await User.findOneBy({ id });
  }

  async createUser(body: CreateUserDTO) {
    const user: User = new User();

    user.name = body.name;
    user.email = body.email;

    await user.save();

    await this.notificationService.sendEmail(
      user.email,
      `
      <a href="${this.configService.get<string>(
        'FRONTEND_BASE_URL',
      )}/verify-account/${
        user.id
      }" target="_blank">Click To Verify Your Account</a>
      `,
      'Please verify your Smart Agriculture Account',
    );

    return user.toJSON();
  }

  async userVerification(id: string, password: string) {
    const user = await User.findOneBy({ id, verified: false });

    if (!user) throw new BadRequestException('User not found!');

    user.password = bcrypt.hashSync(password, 10);
    user.verified = true;
    await user.save();
  }

  async updateUser(requestingUser: User, updateDetails: UpdateUserDTO) {
    if (
      requestingUser.role !== UserRole.SUPER_ADMIN &&
      requestingUser.id !== updateDetails.id
    ) {
      throw new UnauthorizedException();
    }

    const { name, password, role } = updateDetails;

    const userToBeUpdated = await User.findOneBy({ id: updateDetails.id });

    if (name) userToBeUpdated.name = name;
    if (password) userToBeUpdated.name = password;
    if (role !== undefined) userToBeUpdated.role = role;

    await userToBeUpdated.save();
    return userToBeUpdated.toJSON();
  }

  async deleteUser(requestingUser: User, userId: string) {
    if (requestingUser.id === userId) {
      throw new BadRequestException('Unable to delete self');
    }

    const user = await User.findOneBy({ id: userId });
    await user.remove();
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
      user.verified = true;

      await User.upsert([user], {
        conflictPaths: ['email'],
        skipUpdateIfNoValuesChanged: true,
      });
    }
  }
}
