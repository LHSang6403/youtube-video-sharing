import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../prisma/prisma.service';
import { AppModule } from 'src/app.module';

describe('AuthResolver (Integration)', () => {
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
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('register mutation', () => {
    it('should register a new user', async () => {
      const mutation = `
        mutation {
          register(registerInput: { username: "alice", password: "pass", name: "Alice" })
        }
      `;
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      expect(response.body.data.register).toBe(true);

      const user = await prisma.user.findUnique({
        where: { username: 'alice' },
      });
      expect(user).toBeTruthy();
      expect(user?.name).toBe('Alice');
    });
  });

  describe('login mutation', () => {
    it('should return a JWT token', async () => {
      await prisma.user.create({
        data: {
          username: 'bob',
          password: '$2b$10$hashhashhashhashhash',
          name: 'Bob',
        },
      });

      const mutation = `
        mutation {
          login(loginInput: { username: "bob", password: "pass" }) {
            accessToken
          }
        }
      `;
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      expect(response.body.data.login.accessToken).toBeDefined();
    });
  });
});
