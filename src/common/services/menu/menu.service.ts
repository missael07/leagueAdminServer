import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/seed/entities/role.entity';
import { ResponseHandlerService } from 'src/common/handlers/respose.handler';
import { Menu } from 'src/seed/entities/menu.entity';
import { MenuResponse } from 'src/common/interfaces/menuResponse.interface';

@Injectable()
export class MenuService {


  constructor(
    @InjectRepository(Menu)
    private readonly _menuRepo: Repository<Menu>,
    private readonly _responseHandler: ResponseHandlerService,
  ) {
    _responseHandler.logger = new Logger('MenuService');
  }

  private _mapMenuResponse(menu: Menu, errCode: string) {
    try {
      const menuMapped: MenuResponse = {
        menuItem: menu.menuName,
        menuIcon: menu.icon,
        menuRoute: menu.route
      };
      return menuMapped;
    } catch (error) {
      return this._responseHandler.handleExceptions(errCode, error.message ?? error.detail);
    }
  }

  async getMenusByRole(roleValue: number) {
    const menus = await this._menuRepo
      .createQueryBuilder('menu')
      .innerJoinAndSelect('menu.roles', 'role')
      .where('role.value = :roleValue', { roleValue })
      .orderBy('menu.roles', 'ASC')
      .getMany();

    return this._responseHandler.handleSuccess<MenuResponse>(menus.map( (menu) => (this._mapMenuResponse(menu,'mapMenuResp001'))), '',null)
  }
}