import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { JWTPayload } from 'src/common/interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './interface/authResponse';
import { Role } from 'src/common/enums/roles/role.enum';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly _responseHanlder: ResponseHandlerService,
    private readonly _jwtService: JwtService,
  ) { }

  private async _authenticate(userName: string, errCode: string) {
    try {
      const user = await this.userRepository.createQueryBuilder('u')
        .leftJoinAndSelect('u.role', 'r')
        .leftJoinAndSelect('u.teams', 't')
        .where('u.userName = :userName', { userName })
        .getOne();

      if (!user) {
        return this._responseHanlder.handleExceptions(errCode, 'Usuario/Contraseña incorrectas.');
      }
      return user;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _unlockUser(userId: number) {
    const user = await this.userRepository.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect('u.teams', 't')
      .where('u.userId = :userId', { userId })
      .getOne();
    user.isLocked = false;
    user.lockUntil = null;
    user.failedLoginAttempts = 0;

    await this.userRepository.save(user);
  }

  private async _isUserLocked(user: User, errCode: string) {
    const now = new Date();
    if (user.isLocked) {
      if (user.lockUntil && user.lockUntil > now) {
        this._responseHanlder.handleExceptions(
          errCode,
          'Usuario bloqueado, intenta de nuevo en cinco minutos.',
        );
      } else {
        await this._unlockUser(user.userId);
      }
    }
  }

  private async _isPasswordValid(user: User, password: string, errCode: string) {
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts == 5) {
        user.isLocked = true;
        user.lockUntil = new Date(new Date().getTime() + 5 * 60000);
      }
      await this.userRepository.save(user);
      return this._responseHanlder.handleExceptions(errCode, 'Usuario/Contraseña incorrectas.');
    }
  }

  private async _getToken(user: User) {
    return {
      token: this._getJwt({
        id: user.userId,
        userName: user.userName,
        role: user.role.value,
        teamId: user.role.value === Role.admin ? 0 : user.teams[0].teamId
      }),
    };
  }

  private _getJwt(payload: JWTPayload) {
    try {
      const token = this._jwtService.sign(payload);
      return token;
    } catch (error) {
      this._responseHanlder.handleExceptions('aujwt001', error.detail);
    }
  }

  async signIn(createAuthDto: CreateAuthDto) {
    const { userName, password } = createAuthDto;
    const user = await this._authenticate(userName, 'authSignIn001');
    await this._isUserLocked(user, 'vldUsrLck001');
    await this._isPasswordValid(user, password, 'vldPwd001');

    await this._unlockUser(user.userId);

    return this._responseHanlder.handleSuccess<AuthResponse>(null, '', await this._getToken(user));
  }
}
