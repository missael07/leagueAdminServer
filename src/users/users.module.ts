import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/seed/entities/role.entity';
import { Team } from 'src/teams/entities/team.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
    imports: [
      ConfigModule,
      CommonModule,
      TypeOrmModule.forFeature([User, Role, Team]),
    ],
})
export class UsersModule {}
