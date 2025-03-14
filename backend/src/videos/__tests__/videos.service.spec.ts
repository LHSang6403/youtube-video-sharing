import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from '../videos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import { ShareVideoInput } from '../dto/share-video.input';

describe('VideosService (Unit)', () => {
  let videosService: VideosService;
  let prismaService: jest.Mocked<PrismaService>;
  let notificationsGateway: jest.Mocked<NotificationsGateway>;

  beforeEach(async () => {
    const prismaMock = {
      video: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;
    const gatewayMock = {
      sendNotification: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: NotificationsGateway, useValue: gatewayMock },
      ],
    }).compile();

    videosService = module.get<VideosService>(VideosService);
    prismaService = module.get(PrismaService);
    notificationsGateway = module.get(NotificationsGateway);
  });

  describe('shareVideo', () => {
    it('should create a video and send notification', async () => {
      const input: ShareVideoInput = { videoUrl: 'url', title: 'title' };
      const user = { id: 1, name: 'Alice' };
      const mockVideo = {
        id: 1,
        videoUrl: 'url',
        title: 'title',
        user: { name: 'Alice' },
      };

      (prismaService.video.create as jest.Mock).mockResolvedValue(mockVideo);

      const result = await videosService.shareVideo(input, user);
      expect(prismaService.video.create).toHaveBeenCalledWith({
        data: {
          videoUrl: 'url',
          title: 'title',
          user: { connect: { id: 1 } },
        },
        include: { user: true },
      });
      expect(notificationsGateway.sendNotification).toHaveBeenCalledWith({
        title: 'title',
        sharedBy: 'Alice',
      });
      expect(result).toEqual(mockVideo);
    });
  });

  describe('getVideos', () => {
    it('should return list of videos', async () => {
      const mockVideos = [
        { id: 1, videoUrl: 'u1', title: 't1', user: { name: 'A' } },
        { id: 2, videoUrl: 'u2', title: 't2', user: { name: 'B' } },
      ];
      (prismaService.video.findMany as jest.Mock).mockResolvedValue(mockVideos);

      const result = await videosService.getVideos();
      expect(prismaService.video.findMany).toHaveBeenCalledWith({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockVideos);
    });
  });
});
