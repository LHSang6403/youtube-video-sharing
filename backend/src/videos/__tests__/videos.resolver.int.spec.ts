import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../prisma/prisma.service';
import { AppModule } from 'src/app.module';

describe('VideosResolver (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.video.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('get videos query', () => {
    it('should return a list of videos', async () => {
      await prisma.user.create({
        data: {
          username: 'alice',
          password: 'hashedPass',
          name: 'Alice',
          videos: {
            create: {
              videoUrl: 'url1',
              title: 'Title1',
            },
          },
        },
      });

      const query = `
        query {
          videos {
            id
            title
            videoUrl
            sharedBy
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const videos = response.body.data.videos;
      expect(videos).toHaveLength(1);
      expect(videos[0].title).toBe('Title1');
      expect(videos[0].videoUrl).toBe('url1');
      expect(videos[0].sharedBy).toBe('Alice');
    });
  });

  describe('shareVideo mutation', () => {
    it('should create and return new video', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'bob',
          password: 'hash',
          name: 'Bob',
        },
      });

      const mutation = `
        mutation {
          shareVideo(shareVideoInput: { videoUrl: "url2", title: "Title2" }) {
            id
            title
            videoUrl
            sharedBy
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      const created = response.body.data.shareVideo;
      expect(created.title).toBe('Title2');
      expect(created.videoUrl).toBe('url2');
    });
  });
});
