import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  findAll(@Query('data') data: string) {
    return this.teamsService.findAll(JSON.parse(data));
  }

  @Get('teamByUserId')
  findTeamByUserId(@Query('userId') userId: string, @Query('data') data: string) {
    return this.teamsService.findTeamByUserId(+userId);
  }

  @Get('getTeamsForSelect')
  getTeams() {
    return this.teamsService.getTeamsForSelect();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  @Put('changeStatus/:id')
  changeStatus(@Param('id') id: string) {
    return this.teamsService.changeStatus(+id);
  }

  @Put('pay/:id')
  pay(@Param('id') id: string) {
    return this.teamsService.pay(+id);
  }
}
