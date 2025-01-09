import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Category } from 'src/seed/entities/category.entity';
import { Branch } from 'src/seed/entities/branch.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [
    CommonModule,
    ConfigModule,
    TypeOrmModule.forFeature([Team, Category, Branch]),
  ],
})
export class TeamsModule { }
