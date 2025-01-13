import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { ResponseHandlerService } from '../handlers/respose.handler';
import { Role } from '../enums/roles/role.enum';


@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly _responseHandler: ResponseHandlerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: Role[] = this.reflector.get(META_ROLES, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request['user'] as User;

    if (!user) {
      this._responseHandler.handleExceptions('404', 'User not found.');
      return false;
    }

      if (!validRoles || validRoles.length === 0) return true;

      if (!validRoles.includes(user.role.value)) {
        return false;
      }

      return true;
  }
}
