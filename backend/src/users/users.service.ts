import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { CACHE_KEYS } from '@constants/cache-key.constant';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async create(userData: {
    username: string;
    password: string;
    name: string;
  }): Promise<User> {
    this.logger.log(`Creating user with username: ${userData.username}`);
    try {
      const user = await this.prisma.user.create({ data: userData });

      this.logger.log(`User created with id: ${user.id}`);

      await this.redisService.del(CACHE_KEYS.USER_LIST);

      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`Searching user by username: ${username}`);
    try {
      return await this.prisma.user.findUnique({
        where: { username },
      });
    } catch (error) {
      this.logger.error(
        `Error finding user by username: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    this.logger.log(`Searching user by id: ${id}`);

    const cacheKey = CACHE_KEYS.USER_BY_ID(id);
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      this.logger.log(`Returning user ${id} from cache`);
      return JSON.parse(cached);
    }

    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user) {
        await this.redisService.set(cacheKey, JSON.stringify(user), 60);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error finding user by id: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    this.logger.log('Fetching list of users');

    const cached = await this.redisService.get(CACHE_KEYS.USER_LIST);
    if (cached) {
      this.logger.log('Returning users from Redis cache');
      return JSON.parse(cached);
    }

    try {
      const users = await this.prisma.user.findMany();
      await this.redisService.set(
        CACHE_KEYS.USER_LIST,
        JSON.stringify(users),
        60,
      );
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }
}
