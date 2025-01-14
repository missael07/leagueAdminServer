import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { ResponseHandlerService } from '../handlers/respose.handler';
import { Role } from '../enums/roles/role.enum';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly _responseHandler: ResponseHandlerService,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: Role[] = this.reflector.get(META_ROLES, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const user = request['user'] as User;

    if (!token) {
      throw new UnauthorizedException('Token is missing');
      return false;
    }
    if (!user) {
      this._responseHandler.handleExceptions('404', 'User not found.');
      return false;
    }

      if (!validRoles || validRoles.length === 0) return true;

      if (!validRoles.includes(user.role.value)) {
        return false;
      }

      if(!this.jwtService.verify(token)){
        throw new UnauthorizedException('Session expired');
      }

      return true;
  }
}
