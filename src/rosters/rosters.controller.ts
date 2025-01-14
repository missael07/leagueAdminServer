import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RostersService } from './rosters.service';
import { CreateRosterDto } from './dto/create-roster.dto';
import { UpdateRosterDto } from './dto/update-roster.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/roles/role.enum';
import { User } from 'src/users/entities/user.entity';

@Controller('rosters')
@Auth(Role.coach, Role.manager)
export class RostersController {
  constructor(private readonly rostersService: RostersService) {}

  @Post()
  create(@Body() createRosterDto: CreateRosterDto, @GetUser() user: User) {
    return this.rostersService.create(createRosterDto, user);
  }

  @Get()
  findAll(@Query('teamId') teamId: string) {
    return this.rostersService.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rostersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRosterDto: UpdateRosterDto, @GetUser() user: User) {
    return this.rostersService.update(+id, updateRosterDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rostersService.remove(+id);
  }
}
