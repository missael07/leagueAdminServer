import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/seed/entities/role.entity';
import { User } from './entities/user.entity';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { SendEmailService } from 'src/common/services/email/sendEmail';
import { Team } from 'src/teams/entities/team.entity';
import { UserResponse } from './interfaces/userResponse.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
    @InjectRepository(Team)
    private readonly _teamRepo: Repository<Team>,
    private readonly _responseHanlder: ResponseHandlerService,
    private readonly _sendEmailService: SendEmailService
  ) { }

  private async _getRole(roleId: number, errCode: string) {
    try {
      const role = await this._roleRepo.findOne({ where: { roleId } });
      if (!role) {
        return this._responseHanlder.handleExceptions(errCode, 'No se encontro el rol.');
      }
      return role;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

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

  private async _createTeamObj(createUserDto: CreateUserDto, role: Role, team: Team, errCode: string) {
    try {
      const { firstName, lastName, email, phoneNumber, password: pass, userName } = createUserDto;
      const createdBy = 'Missael Padilla';
      const createdDate = new Date()
      const teams = [team];
      const password = bcrypt.hashSync(pass, 10)
      const user = await this._userRepo.create({
        createdBy,
        createdDate,
        firstName,
        lastName,
        role,
        teams,
        email,
        phoneNumber,
        password,
        userName
      })
      return user;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private async _save(user: User, errCode: string) {
    try {
      const userSaved = await this._userRepo.save(user)
      return userSaved;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  private _map(user: User, errCode: string) {
    try {
      const userMapped: UserResponse = {
        id: user.userId,
        userName: user.userName,
        name: `${user.firstName} ${user.lastName}`,
        isActive: user.isActive,
        email: user.email,
        createdBy: user.createdBy,
        role: user.role.name,
        teams: user.teams
      };
      return userMapped;
    } catch (error) {
      return this._responseHanlder.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { roleId, teamId } = createUserDto;
    const role = await this._getRole(roleId, 'getRoleCrt001');
    const team = await this._getTeam(teamId, 'getTeamCrt001');
    const user = await this._createTeamObj(createUserDto, role, team, 'usrObjCrt001');
    const result = await this._save(user, 'usrSaveCrt001')

    return this._responseHanlder.handleSuccess<UserResponse>([], 'Usuario creado exitosamente.', this._map(result, 'mapUsrCrt001'));
  }

  async findAll() {
    const users = await this._userRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect('u.teams', 't')
      .getMany();

    return this._responseHanlder.handleSuccess<UserResponse>(users.map((user) => (this._map(user, 'mapUsrFnd001'))), '', null);
  }

  async findOne(userId: number) {
    const user = await this._userRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect('u.teams', 't')
      .where('u.userId = :userId', { userId })
      .getOne();

    return this._responseHanlder.handleSuccess<UserResponse>(null, '', this._map(user, 'mapUsrFndOne001'));
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this._userRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect('u.teams', 't')
      .where('u.userId = :userId', { userId })
      .getOne();

    if (!user) {
      return this._responseHanlder.handleExceptions('getUserFnd001', 'No se encontro el equipo.');
    }

    if(user.role.value !== updateUserDto.roleId) {
      const role = await this._getRole(updateUserDto.roleId, 'getRoleUpd001' );
      user.role = role;
    }

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.phoneNumber = updateUserDto.phoneNumber;
    user.userName = updateUserDto.userName;
    user.isActive = updateUserDto.isActive;
    user.updatedBy = 'Missael Padilla';
    user.updatedDate = new Date();

    await this._save(user, 'saveUserUpd001');
    return this._responseHanlder.handleSuccess<UserResponse>([], `Usuario actualizado correctanmente.`, this._map(user, 'mapUsrUpd001'))
  }

  async changeStatus(userId: number) {
    const user = await this._userRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect('u.teams', 't')
      .where('u.userId = :userId', { userId })
      .getOne();

    if (!user) {
      return this._responseHanlder.handleExceptions('getuserFnd001', 'No se encontro el equipo.');
    }

    user.isActive = !user.isActive;
    user.updatedBy = 'Missael Padilla';
    user.updatedDate = new Date();

    await this._save(user, 'saveUserChngStat001');
    const message = user.isActive ? 'habilitado' : 'deshabilitado';
    return this._responseHanlder.handleSuccess<UserResponse>([], `El equipo ${user.firstName}  se a ${message} correctamente.`, this._map(user, 'mapUsrChngStat001'))
  }
}
