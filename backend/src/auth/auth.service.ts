import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, plainPassword: string): Promise<any> {
    this.logger.log(`Validating user: ${username}`);
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      return null;
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      this.logger.log(`User validated: ${username}`);
      return result;
    }

    this.logger.warn(`Validation failed for user: ${username}`);
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    this.logger.log(`Generating JWT for user: ${user.username}`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: {
    username: string;
    password: string;
    name: string;
  }) {
    this.logger.log(`Registering new user: ${userData.username}`);

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

    const createdUser = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    return createdUser;
  }
}
