import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PlayerType } from './entities/playerType.entity';
import { Branch } from './entities/branch.entity';
import { Category } from './entities/category.entity';
import { Menu } from './entities/menu.entity';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(PlayerType)
    private readonly playerTypeRepo: Repository<PlayerType>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }

  async create() {
    await this._createAdminUser();
    await this._createRoles();
    await this._createPlayerTypes();
    await this._createBranches();
    await this._createCategories();
    await this._createMenusByRole();
    return 'Create data successfully';
  }

  private async _createRoles() {
    const roleCount = await this.roleRepo.count();

    if (roleCount <= 0) {
      const roles: Role[] = [
        { roleId: 1, name: 'Admin', value: 1, isActive: true, menus: [] },
        { roleId: 2, name: 'Manager', value: 2, isActive: true, menus: [] },
        { roleId: 3, name: 'Couch', value: 3, isActive: true, menus: [] },
      ]

      const queryBuilder = this.roleRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(Role)
        .values(roles)
        .execute();
    }
  }

  private async _createAdminUser() {
    const userCount = await this.userRepo.count();

    if (userCount <= 0) {

      const adminRole = await this.roleRepo.findOne({ where: { roleId: 1 } });
      const user = await this.userRepo.create({
        firstName: '',
        lastName: '',
        email: '',
        userName: 'premierAdmin',
        password: bcrypt.hashSync(process.env.TEMP_PASSWORD, 10),
        isActive: true, 
        phoneNumber: '', 
        role: adminRole,
        createdBy: 'seed',
        createdDate: new Date(),
      })

      await this.userRepo.save(user);
    }
  }
  private async _createBranches() {
    const branchesCount = await this.branchRepo.count();

    if (branchesCount <= 0) {

      const branches: Branch[] = [
        { branchId: 1, name: 'Varonil', value: 1, isActive: true },
        { branchId: 2, name: 'Femenil', value: 2, isActive: true },
      ]
      const queryBuilder = this.branchRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(Branch)
        .values(branches)
        .execute();
    }
  }

  private async _createCategories() {
    const categoriesCount = await this.categoryRepo.count();

    if (categoriesCount <= 0) {

      const categories: Category[] = [
        { categoryId: 1, name: 'R', value: 1, isActive: true },
        { categoryId: 2, name: 'E', value: 2, isActive: true },
        { categoryId: 3, name: 'D', value: 3, isActive: true },
        { categoryId: 4, name: 'C', value: 4, isActive: true },
        { categoryId: 5, name: 'B', value: 5, isActive: true },
        { categoryId: 6, name: 'A', value: 6, isActive: true },
      ]
      const queryBuilder = this.categoryRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(Category)
        .values(categories)
        .execute();
    }
  }

  private async _createPlayerTypes() {
    const playerTypesCount = await this.playerTypeRepo.count();

    if (playerTypesCount <= 0) {

      const playerTypes: PlayerType[] = [
        { playerTypeId: 1, name: 'Refuerzo', value: 1, isActive: 'active' },
        { playerTypeId: 2, name: 'No puede jugar', value: 2, isActive: 'active' },
        { playerTypeId: 3, name: 'No puede pitchar', value: 3, isActive: 'active' },
      ]
      const queryBuilder = this.playerTypeRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(PlayerType)
        .values(playerTypes)
        .execute();
    }
  }

  private async _createMenusByRole() {
    const menusCount = await this.menuRepo.find();

    if (menusCount.length <= 0) {
      const admin = await this.roleRepo.findOne({ where: { value: 1 } });
      const manager = await this.roleRepo.findOne({ where: { value: 2 } });
      const coach = await this.roleRepo.findOne({ where: { value: 3 } });


      if (!admin || !manager || !coach) {
        throw new Error('Roles not found');
      }

      const menus: Menu[] = [
        {
          menuId: 1, menuName: 'Equipos', route: '/admin/team/teamlist', icon: 'mdi-trophy', roles: [admin], order: 1
        },
        {
          menuId: 2, menuName: 'Usuarios', route: '/admin/users/userslist', icon: 'mdi-account-multiple', roles: [admin], order: 2
        },
        {
          menuId: 3, menuName: 'Cedulas', route: '/admin/rosters/rosterlist', icon: 'mdi-file-document', roles: [admin], order: 3
        },
        {
          menuId: 4, menuName: 'Ajustes', route: '/account/settings', icon: 'mdi-cog', roles: [admin, manager, coach], order: 4
        },
        {
          menuId: 4, menuName: 'Equipo', route: '/managers/team/teampage', icon: 'mdi-trophy', roles: [manager, coach], order: 1
        },
        {
          menuId: 4, menuName: 'Cedulas', route: '/managers/rosters/rosterlist', icon: 'mdi-file-document', roles: [manager, coach], order: 3
        },

      ];

      await this.menuRepo.save(menus);

    }
  }

}
