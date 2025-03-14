import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ShareVideoInput } from './dto/share-video.input';
import { Video as PrismaVideo } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { CACHE_KEYS } from '@constants/cache-key.constant';

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
    private redisService: RedisService,
  ) {}

  async shareVideo(
    data: ShareVideoInput,
    user: any,
  ): Promise<PrismaVideo & { user: { name: string } }> {
    this.logger.log(`User ${user.id} sharing video: ${data.title}`);
    try {
      const video = await this.prisma.video.create({
        data: {
          videoUrl: data.videoUrl,
          title: data.title,
          user: { connect: { id: user.id } },
        },
        include: { user: true },
      });
      this.logger.log(`Video created with id: ${video.id}`);

      await this.redisService.del(CACHE_KEYS.VIDEO_LIST);

      this.notificationsGateway.sendNotification({
        title: video.title,
        sharedBy: video.user.name,
      });

      return video;
    } catch (error) {
      this.logger.error(`Failed to share video: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getVideos(): Promise<(PrismaVideo & { user: { name: string } })[]> {
    this.logger.log('Fetching list of videos');

    const cached = await this.redisService.get(CACHE_KEYS.VIDEO_LIST);
    if (cached) {
      this.logger.log('Returning videos from Redis cache');
      return JSON.parse(cached);
    }

    try {
      const videos = await this.prisma.video.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });

      await this.redisService.set(
        CACHE_KEYS.VIDEO_LIST,
        JSON.stringify(videos),
        60,
      );

      return videos;
    } catch (error) {
      this.logger.error(
        `Failed to fetch videos: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
