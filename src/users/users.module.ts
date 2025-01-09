import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/seed/entities/role.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
    imports: [
      ConfigModule,
      TypeOrmModule.forFeature([User, Role]),
    ],
})
export class UsersModule {}
