import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    return await User.verifyUser(email, password);
  }

  async login(login: LoginDTO) {
    const user = await this.validateUser(login.email, login.password);

    const sessionId = uuidv4();
    const token = this.jwtService.sign({ user: user.toJSON(), sessionId });

    this.cacheManager.set(user.id, sessionId, { ttl: 0 });

    return { user: user.toJSON(), token };
  }

  async logout(userId: string) {
    await this.cacheManager.del(userId);
  }
}
