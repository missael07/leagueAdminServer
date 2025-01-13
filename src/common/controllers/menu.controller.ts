import { Controller, Get, Query } from '@nestjs/common';
import { MenuService } from '../services/menu/menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findAll(@Query('role') role: string) {
    console.log(role);
    return this.menuService.getMenusByRole(+role);
  }

}