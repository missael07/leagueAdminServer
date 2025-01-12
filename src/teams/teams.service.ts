import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/seed/entities/category.entity';
import { Branch } from 'src/seed/entities/branch.entity';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { SendEmailService } from 'src/common/services/email/sendEmail';
import { TeamResponse } from './interfaces/responseTeam.interface';
import { TeamFilter } from './interfaces/teamFilter.interface';

@Injectable()
export class TeamsService {

  constructor(
    @InjectRepository(Team)
    private readonly _teamRepo: Repository<Team>,
    @InjectRepository(Category)
    private readonly _categoryRepo: Repository<Category>,
    @InjectRepository(Branch)
    private readonly _branchRepo: Repository<Branch>,
    private readonly _responseHanlder: ResponseHandlerService,
    private readonly _sendEmailService: SendEmailService
  ) { }

  private async _getCategory(categoryId: number, errCode: string) {
    try {
      const category = await this._categoryRepo.createQueryBuilder('c').where('c.categoryId = :categoryId', { categoryId }).getOne();
      return category;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _getBranch(branchId: number, errCode: string) {
    try {
      const branch = await this._branchRepo.createQueryBuilder('b').where('b.branchId = :branchId', { branchId }).getOne();
      return branch;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _createTeamObj(createTeamDto: CreateTeamDto, category: Category, branch: Branch, errCode: string) {
    try {
      const { name, isPaid } = createTeamDto;
      const createdBy = 'Missael Padilla';
      const createdDate = new Date()
      const team = await this._teamRepo.create({
        createdBy,
        createdDate,
        name,
        category,
        branch,
        isPaid
      })
      return team;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _save(team: Team, errCode: string) {
    try {
      const teamSaved = await this._teamRepo.save(team)
      return teamSaved;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private _map(team: Team, errCode: string) {
    try {
      const teamMapped: TeamResponse = {
        id: team.teamId,
        name: team.name,
        isActive: team.isActive,
        isPaid: team.isPaid,
        category: team.category.value,
        categoryName: team.category.name,
        branch: team.branch.value,
        branchName: team.branch.name
      };
      return teamMapped;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private _getDataNewInvite(teamName: string) {
    return {
      url: `${process.env.WEB_URL}/signup`,
      template: 'team-added',
      subject: `Bienvenidos ${teamName}`
    }
  }

  private async _sendEmail(email: string, teamName: string, category: string, division: string) {
    const context = { url: '', websiteName: '', teamName, leagueName: 'Liga Premier de Softball de Mexicali', email, category, division };
    let template;
    let subject;

    const newData = this._getDataNewInvite(teamName);
    context.url = newData.url;
    template = newData.template;
    subject = newData.subject;

    await this._sendEmailService.sendEmail(
      email,
      context,
      template,
      subject,
    );
  }

  async create(createTeamDto: CreateTeamDto) {
    const { category, branch, email } = createTeamDto;
    const categoryToSave = await this._getCategory(category, 'getCategoryCrt001');
    if (!categoryToSave) {
      return this._responseHanlder.handleExceptions('getCategoryCrt001', 'No se encontro la categoria.');
    }
    const branchToSave = await this._getBranch(branch, 'getBranchCrt001');
    if (!branchToSave) {
      return this._responseHanlder.handleExceptions('getBranchCrt001', 'No se encontro la rama');
    }
    const team = await this._createTeamObj(createTeamDto, categoryToSave, branchToSave, 'getObjCrt001');
    const result = await this._save(team, 'saveTeamCrt001');

    await this._sendEmail(email, result.name, categoryToSave.name, branchToSave.name);

    return this._responseHanlder.handleSuccess<TeamResponse>([], 'El equipo se agrego correctamente.', this._map(result, 'mapCrt001'))
  }

  async findAll(data: TeamFilter) {
    const { term, isActive, category, branch, isPaid } = data;
    const queryBuilder = this._teamRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.branch', 'b')
      .where('1 = 1')
      .orderBy('t.teamId', 'DESC');

    if (isActive !== null) {
      queryBuilder.andWhere('t.isActive = :isActive', { isActive })
    }

    if (category) {
      queryBuilder.andWhere('t.categoryId = :category', { category })
    }

    if (branch) {
      queryBuilder.andWhere('t.branchId = :branch', { branch })
    }

    if (isPaid !== null) {
      queryBuilder.andWhere('t.isPaid = :isPaid', { isPaid })
    }

    if (term) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('t.name ILIKE :term', { term: `%${term}%` })
        }),
      );
    }

    const teams = await queryBuilder.getMany();
    return this._responseHanlder.handleSuccess<TeamResponse>(teams.map((team) => (this._map(team, 'mapFndAll001'))), '', null)
  }

  async findOne(teamId: number) {
    const team = await this._teamRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.branch', 'b')
      .where('t.teamId = :teamId', { teamId })
      .getOne();

    return this._responseHanlder.handleSuccess<TeamResponse>([], '', this._map(team, 'mapFndAll001'))
  }

  async update(teamId: number, updateTeamDto: UpdateTeamDto) {
    const { category, branch, name, isPaid, isActive } = updateTeamDto;
    const team = await this._teamRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.branch', 'b')
      .where('t.teamId = :teamId', { teamId })
      .getOne();

    if (!team) {
      return this._responseHanlder.handleExceptions('getTeamFnd001', 'No se encontro el equipo.');
    }

    if (team.category.value !== category) {
      const categoryToSave = await this._getCategory(category, 'getCategoryCrt001');
      if (!categoryToSave) {
        return this._responseHanlder.handleExceptions('getCategoryCrt001', 'No se encontro la categoria.');
      }
      team.category = categoryToSave;
    }

    if (team.branch.value !== branch) {
      const branchToSave = await this._getBranch(branch, 'getBranchCrt001');
      if (!branchToSave) {
        return this._responseHanlder.handleExceptions('getBranchCrt001', 'No se encontro la rama');
      }
      team.branch = branchToSave;
    }

    team.name = name;
    team.isActive = isActive;
    team.isPaid = isPaid;
    team.updatedBy = 'Missael Padilla';
    team.updatedDate = new Date();

    await this._save(team, 'saveTeamUpd001');
    return this._responseHanlder.handleSuccess<TeamResponse>([], `El equipo ${team.name} se a actualizado correctamente.`, this._map(team, 'mapFndAll001'))

  }

  async changeStatus(teamId: number) {
    const team = await this._teamRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.branch', 'b')
      .where('t.teamId = :teamId', { teamId })
      .getOne();

    if (!team) {
      return this._responseHanlder.handleExceptions('getTeamFnd001', 'No se encontro el equipo.');
    }

    team.isActive = !team.isActive;
    team.updatedBy = 'Missael Padilla';
    team.updatedDate = new Date();

    await this._save(team, 'saveTeamChngStat001');
    const message = team.isActive ? 'habilitado' : 'deshabilitado';
    return this._responseHanlder.handleSuccess<TeamResponse>([], `El equipo ${team.name} se a ${message} correctamente.`, this._map(team, 'mapFndAll001'))
  }

  async pay(teamId: number) {
    const team = await this._teamRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .leftJoinAndSelect('t.branch', 'b')
      .where('t.teamId = :teamId', { teamId })
      .getOne();

    if (!team) {
      return this._responseHanlder.handleExceptions('getTeamFnd001', 'No se encontro el equipo.');
    }

    team.isPaid = true;
    team.updatedBy = 'Missael Padilla';
    team.updatedDate = new Date();

    await this._save(team, 'saveTeamChngStat001');
    const message = team.isActive ? 'habilitado' : 'deshabilitado';
    return this._responseHanlder.handleSuccess<TeamResponse>([], `Cuota pagada correctamente.`, this._map(team, 'mapFndAll001'))
  }

  async getTeamsForSelect() {
    const teams = await this._teamRepo.createQueryBuilder('t')
      .select(['t.teamId', 't.name'])
      .where('t.isActive = :isActive', { isActive: true })
      .orderBy('t.name', 'ASC')
      .getMany();

    return this._responseHanlder.handleSuccess(teams.map(( team: Team) => ({value: team.teamId, title: team.name})), '', null);
  }
}
