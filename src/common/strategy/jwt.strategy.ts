import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { PassportStrategy } from '@nestjs/passport';
  import { ExtractJwt, Strategy } from 'passport-jwt';
  import { User } from 'src/users/entities/user.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { ConfigService } from '@nestjs/config';
import { ResponseHandlerService } from '../handlers/respose.handler';
import { JWTPayload } from '../interfaces/jwt.interface';
  
  @Injectable()
  export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
      configService: ConfigService,
      private readonly _handleErrorsService: ResponseHandlerService,
    ) {
      super({
        secretOrKey: configService.get('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      });
    }
  
    async validate(payload: JWTPayload): Promise<string> {
      const { id } = payload;
  
      const user = await this.userRepo.findOneBy({ userId: +id });
  
      delete user.password;
      if (!user)
        this._handleErrorsService.handleExceptions('404', 'User not foud.');
  
      return `${user.firstName} ${user.lastName}`;
    }
  }
  