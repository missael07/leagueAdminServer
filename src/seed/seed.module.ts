import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { PlayerType } from './entities/playerType.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Branch } from './entities/branch.entity';
import { Category } from './entities/category.entity';
import { Menu } from './entities/menu.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Role,  PlayerType, Branch, Category, Menu, User]),
  ],
})
export class SeedModule {}
