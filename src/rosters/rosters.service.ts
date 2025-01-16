import { Injectable } from '@nestjs/common';
import { CreateRosterDto } from './dto/create-roster.dto';
import { UpdateRosterDto } from './dto/update-roster.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roster } from './entities/roster.entity';
import { Repository } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { User } from 'src/users/entities/user.entity';
import { RosterResponse } from './interfaces/rosterResponse.interface';
import { StringUtil } from 'src/common/utils/clean.service';

@Injectable()
export class RostersService {

  constructor(
    @InjectRepository(Roster)
    private readonly _rosterRepository: Repository<Roster>,
    @InjectRepository(Team)
    private readonly _teamRepo: Repository<Team>,
    private readonly _responseHanlder: ResponseHandlerService,
  ) { }

  private async _getTeam(teamId: number, errCode: string) {
    try {
      const team = await this._teamRepo.findOne({ where: { teamId } });
      if (!team) {
        return this._responseHanlder.handleExceptions(errCode, 'No se encontro el equipo.');
      }
      return team;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _createRosterObj(createRosterDto: CreateRosterDto, team: Team, createdBy: string, errCode: string) {
    try {
      const { firstName, lastName, imgUrl } = createRosterDto;
      const createdDate = new Date()
      const user = await this._rosterRepository.create({
        createdBy,
        createdDate,
        firstName,
        lastName,
        team,
        imgUrl
      })
      return user;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _save(roster: Roster, errCode: string) {
    try {
      const rosterSaved = await this._rosterRepository.save(roster)
      return rosterSaved;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private _map(roster: Roster, errCode: string) {
    try {
      const rosterMapped: RosterResponse = {
        id: roster.rosterId,
        name: `${roster.firstName} ${roster.lastName}`,
        firstName: roster.firstName,
        lastName: roster.lastName,
        isReinforcement: roster.isReinforcement,
        imgUrl: roster.imgUrl,
        blockedToPitch: roster.blockedToPitch,
        blockedToPlay: roster.blockedToPlay
      };
      return rosterMapped;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _finOneById(id: number, errCode: string) {
    try {
      const player = await this._rosterRepository.createQueryBuilder('r')
        .where('r.rosterId = :id', { id })
        .getOne();

      if (!player) {
        return this._responseHanlder.handleExceptions(errCode, 'No se encontro el registro.');
      }

      return player
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  async create(createRosterDto: CreateRosterDto, user: User) {
    const { teamId } = createRosterDto;
    const team = await this._getTeam(teamId, 'getTeamRosterCrt001');
    const roster = await this._createRosterObj(createRosterDto, team, `${user.firstName} ${user.lastName}`, 'rstrObjCrt001');
    const result = await this._save(roster, 'rstrSaveCrt001')
    return this._responseHanlder.handleSuccess<RosterResponse>([], 'Registro agregado exitosamente.', this._map(result, 'mapRstrCrt001'));
  }

  async findAll(teamId: string) {
    const queryBuilder = this._rosterRepository.createQueryBuilder('r').orderBy("r.rosterId", 'ASC')
    if (teamId) {
      queryBuilder.where('r.teamId = :teamId', { teamId })
    }
    
    const players = await queryBuilder.getMany();

    return this._responseHanlder.handleSuccess<RosterResponse>(players.map((player) => (this._map(player, 'mapRstrFndOne001'))), '', null);
  }

  async findOne(id: number) {
    const player = await this._finOneById(id, 'getRosterFndOne001');
    return this._responseHanlder.handleSuccess<RosterResponse>([], '', this._map(player, 'mapRstrFndOne001'));
  }

  async update(id: number, updateRosterDto: UpdateRosterDto, user: User) {
    const player = await this._finOneById(id, 'getRosterFndOne001');

    player.firstName = updateRosterDto.firstName;
    player.lastName = updateRosterDto.lastName;
    player.blockedToPitch = updateRosterDto.blockedToPitch;
    player.blockedToPlay = updateRosterDto.blockedToPlay;
    player.isReinforcement = updateRosterDto.isReinforcement;
    player.updatedBy = StringUtil.getLoggedUserFullName(user);
    player.updatedDate = new Date();

    await this._save(player, 'rstrSaveUpd001')
    return this._responseHanlder.handleSuccess<RosterResponse>([], 'Registro actualizado correctamente.', this._map(player, 'mapRstrUpd001'));
  }

  async remove(id: number) {
    const player = await this._finOneById(id, 'getRosterFndOne001');
    try {
      await this._rosterRepository.remove(player);
      return this._responseHanlder.handleSuccess<RosterResponse>([], 'Registro eliminado correctamente.', null);
    } catch (error) {
      return this._responseHanlder.handleExceptions('rmvRstr0001', error.message ?? error.detail);
    }

  }
}
