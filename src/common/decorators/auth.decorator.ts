import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../enums/roles/role.enum';
import { RoleProtected } from './role-protected.decorator';
import { UserGuard } from '../guard/user.guard';

export function Auth(...roles: Role[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserGuard)
    )
}