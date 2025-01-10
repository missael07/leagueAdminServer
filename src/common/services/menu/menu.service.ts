import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/seed/entities/role.entity';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { Menu } from 'src/seed/entities/menu.entity';

@Injectable()
export class MenuService {

  
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {
    responseHandlerService.logger = new Logger('MenuService');
  }

  async getMenusByRole(roleValue: number, companyType: number): Promise<Menu[]> {
    const menus = await this.menuRepo
    .createQueryBuilder('menu')
    .innerJoinAndSelect('menu.roles', 'role')
    .innerJoinAndSelect('menu.companyTypes', 'companyType')
    .where('role.value = :roleValue', { roleValue })
    .andWhere('companyType.value = :companyType', { companyType })
    .orderBy('menu.roles', 'ASC')
    .getMany();
  
  return menus;
  }
}