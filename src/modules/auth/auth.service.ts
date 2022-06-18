import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { User } from '../user/user.entity';
import { AuthSession } from './auth-session.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User> {
    return await User.verifyUser(email, password);
  }

  async login(login: LoginDTO) {
    const user = await this.validateUser(login.email, login.password);

    if (!user) throw new BadRequestException('Invalid email or password');

    const session = new AuthSession();
    session.userId = user.id;

    await session.save();

    const token = this.jwtService.sign({
      user: user.toJSON(),
      sessionId: session.id,
    });

    return { user: user.toJSON(), token };
  }

  async logout(userId: string) {
    await AuthSession.delete({ userId });
  }
}
