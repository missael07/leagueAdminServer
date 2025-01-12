import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { Branch } from "src/common/enums/branch/branch.enum";
import { Category } from "src/common/enums/category/category.enum";
import { StringUtil } from "src/common/utils/clean.service";

export class CreateTeamDto {

    @IsNotEmpty({ message: 'El nombre es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    name: string;

    @IsNotEmpty({ message: 'El e-mail es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    email: string;

    @IsNotEmpty({ message: 'La Categoria es requerida.' })
    @Transform(({ value }) => isNaN(value) || value === 0 ? '' : value)
    category: Category;

    @IsNotEmpty({ message: 'La rama es requerida.' })
    @Transform(({ value }) => isNaN(value) || value === 0 ? '' : value)
    branch: Branch;

    @IsBoolean()
    isPaid: boolean;
}
