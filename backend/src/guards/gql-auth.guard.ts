import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GqlAuthGuard.name);

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req || { headers: {} };
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user || typeof user === 'boolean') {
      throw err || new UnauthorizedException();
    }

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();

    let payload: any;
    try {
      payload = jwt.decode(token);
    } catch (decodeError) {
      throw new UnauthorizedException('Invalid token');
    }

    this.logger.log(`Decoded token payload: ${JSON.stringify(payload)}`);

    return user;
  }
}
