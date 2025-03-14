import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService (Unit)', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const usersServiceMock = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    } as any;
    const jwtServiceMock = {
      sign: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user object (without password) if password matches', async () => {
      const mockUser = {
        id: 1,
        username: 'alice',
        password: 'hashedPassword',
        name: 'Alice',
      };
      usersService.findByUsername.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser('alice', 'plainPassword');
      expect(usersService.findByUsername).toHaveBeenCalledWith('alice');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword',
        'hashedPassword',
      );
      expect(result).toEqual({
        id: 1,
        username: 'alice',
        name: 'Alice',
      });
    });

    it('should return null if user not found or password mismatch', async () => {
      usersService.findByUsername.mockResolvedValue(null);
      const result = await authService.validateUser('bob', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a JWT token', async () => {
      const mockUser = { id: 1, username: 'alice' };
      jwtService.sign.mockReturnValue('fake-jwt-token');

      const result = await authService.login(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'alice',
        sub: 1,
      });
      expect(result).toEqual({ access_token: 'fake-jwt-token' });
    });
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      usersService.create.mockResolvedValue({
        id: 2,
        username: 'bob',
        password: 'hashedPassword',
        name: 'Bob',
      });

      const result = await authService.register({
        username: 'bob',
        password: 'plainPass',
        name: 'Bob',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPass', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        username: 'bob',
        password: 'hashedPassword',
        name: 'Bob',
      });
      expect(result).toEqual({
        id: 2,
        username: 'bob',
        password: 'hashedPassword',
        name: 'Bob',
      });
    });
  });
});
