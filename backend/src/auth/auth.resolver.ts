import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { LoginResponse } from './dto/login-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<User> {
    return await this.authService.register(registerInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      loginInput.username,
      loginInput.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = await this.authService.login(user);
    return { accessToken: token.access_token };
  }
}
