import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PlayerType } from './entities/playerType.entity';
import { Branch } from './entities/branch.entity';
import { Category } from './entities/category.entity';
import { Menu } from './entities/menu.entity';

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
    private readonly menuRepo: Repository<Menu>
  ){}

  async create() {
    await this._createRoles();
    await this._createPlayerTypes();
    await this._createBranches();
    await this._createCategories();
    await this._createMenusByRole();
    return 'Create data successfully';
  }

  private async _createRoles(){
    const roleCount = await this.roleRepo.count();

    if (roleCount <= 0) {
      const roles: Role[] = [
        { roleId: 1, name: 'Admin', value: 1, isActive: true, menus: []},
        { roleId: 2, name: 'Manager', value: 2, isActive: true, menus: []},
        { roleId: 3, name: 'Couch', value: 3, isActive: true, menus: []},
      ]

      const queryBuilder = this.roleRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(Role)
        .values(roles)
        .execute();
    }
  }
  
  private async _createBranches(){
    const branchesCount = await this.branchRepo.count();

    if (branchesCount <= 0) {

      const branches: Branch[] = [
        { branchId: 1, name: 'Varonil', value: 1, isActive: true},
        { branchId: 2, name: 'Femenil', value: 2, isActive: true},
      ]
      const queryBuilder = this.branchRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(Branch)
        .values(branches)
        .execute();
    }
  }

  private async _createCategories(){
    const categoriesCount = await this.categoryRepo.count();

    if (categoriesCount <= 0) {

      const categories: Category[] = [
        { categoryId: 1, name: 'C', value: 1, isActive: true},
        { categoryId: 2, name: 'D', value: 2, isActive: true },
        { categoryId: 3, name: 'E', value: 3, isActive: true },
        { categoryId: 4, name: 'R', value: 4, isActive: true },
      ]
      const queryBuilder = this.categoryRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(Category)
        .values(categories)
        .execute();
    }
  }

  private async _createPlayerTypes(){
    const playerTypesCount = await this.playerTypeRepo.count();

    if (playerTypesCount <= 0) {

      const playerTypes: PlayerType[] = [
        { playerTypeId: 1, name: 'Refuerzo', value: 1, isActive: 'active'},
        { playerTypeId: 2, name: 'No puede jugar', value: 2, isActive: 'active'},
        { playerTypeId: 3, name: 'No puede pitchar', value: 3, isActive: 'active'},
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


      if (!admin || !manager || !coach ) {
        throw new Error('Roles not found');
      }

      const menus: Menu[] = [
        {
          menuId: 1, menuName: 'Equipos', route: 'company-list', icon: 'mdi-domain', roles: [admin]
        },
        {
          menuId: 2, menuName: 'Usuarios', route: 'users-list', icon: 'mdi-home', roles: [admin]
        },
        {
          menuId: 3, menuName: 'Cedulas', route: 'rosters-list', icon: 'mdi-account-outline', roles: [admin, manager, coach]
        },
        {
          menuId: 4, menuName: 'Ajustes', route: 'account-settings', icon: 'mdi-cog', roles: [admin, manager, coach]
        },

      ];

      await this.menuRepo.save(menus);

    }
  }

}
