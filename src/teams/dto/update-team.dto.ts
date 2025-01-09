import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { StringUtil } from 'src/common/utils/clean.service';
import { Branch } from 'src/common/enums/branch/branch.enum';
import { Category } from 'src/common/enums/category/category.enum';

export class UpdateTeamDto {
    @IsNotEmpty({ message: 'El nombre es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    name: string;

    @IsNotEmpty({ message: 'La Categoria requerido.' })
    @Transform(({ value }) => isNaN(value) ? '' : value)
    category: Category;

    @IsNotEmpty({ message: 'La rama es requerida.' })
    @Transform(({ value }) => isNaN(value) ? '' : value)
    branch: Branch;

    @IsBoolean()
    isPaid: boolean;

    @IsBoolean()
    isActive: boolean;
}
