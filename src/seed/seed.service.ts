import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PlayerType } from './entities/playerType.entity';
import { Branch } from './entities/branch.entity';
import { Category } from './entities/category.entity';

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
    private readonly categoryRepo: Repository<Category>
  ){}

  async create() {
    await this._createRoles();
    await this._createPlayerTypes();
    await this._createBranches();
    await this._createCategories();
    return 'Create data successfully';
  }

  private async _createRoles(){
    const roleCount = await this.roleRepo.count();

    if (roleCount <= 0) {
      const roles: Role[] = [
        { roleId: 1, name: 'Admin', value: 1, status: true},
        { roleId: 2, name: 'Manager', value: 2, status: true},
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
        { branchId: 1, name: 'Varonil', value: 1, status: true},
        { branchId: 2, name: 'Femenil', value: 2, status: true},
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
        { categoryId: 1, name: 'C', value: 1, status: true},
        { categoryId: 2, name: 'D', value: 2, status: true },
        { categoryId: 3, name: 'E', value: 3, status: true },
        { categoryId: 4, name: 'R', value: 4, status: true },
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
        { playerTypeId: 1, name: 'Refuerzo', value: 1, status: 'active'},
        { playerTypeId: 2, name: 'No puede jugar', value: 2, status: 'active'},
        { playerTypeId: 3, name: 'No puede pitchar', value: 3, status: 'active'},
      ]
      const queryBuilder = this.playerTypeRepo.createQueryBuilder();

      await queryBuilder
        .insert()
        .into(PlayerType)
        .values(playerTypes)
        .execute();
    }
  }

}
