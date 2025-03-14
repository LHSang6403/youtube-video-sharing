import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService (Unit)', () => {
  let usersService: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const prismaMock = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;
  });

  describe('create', () => {
    it('should create a user', async () => {
      (prismaService.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'alice',
        password: 'hashedPass',
        name: 'Alice',
      });

      const user = await usersService.create({
        username: 'alice',
        password: 'hashedPass',
        name: 'Alice',
      });

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'alice',
          password: 'hashedPass',
          name: 'Alice',
        },
      });
      expect(user.id).toBe(1);
    });
  });

  describe('findByUsername', () => {
    it('should return user if found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        username: 'alice',
        password: 'hashedPass',
        name: 'Alice',
      });

      const user = await usersService.findByUsername('alice');
      expect(user?.username).toBe('alice');
    });
  });

  describe('findById', () => {
    it('should return user if found by ID', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        username: 'bob',
        password: 'hashedPass',
        name: 'Bob',
      });

      const user = await usersService.findById(2);
      expect(user?.username).toBe('bob');
    });
  });
});
