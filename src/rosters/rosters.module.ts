import { Module } from '@nestjs/common';
import { RostersService } from './rosters.service';
import { RostersController } from './rosters.controller';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { Roster } from './entities/roster.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [RostersController],
  providers: [RostersService],
  imports: [
    CommonModule,
    ConfigModule,
    TypeOrmModule.forFeature([Roster, Team]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule
  ],
})
export class RostersModule { }
