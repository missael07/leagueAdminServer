import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { Role } from "src/common/enums/roles/role.enum";
import { StringUtil } from "src/common/utils/clean.service";

export class UpdateUserDto {


    @IsNotEmpty({ message: 'El nombre de usuario es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    userName: string;

    @IsNotEmpty({ message: 'El rol es requerido.' })
    @Transform(({ value }) => isNaN(value) ? '' : value)
    roleId: Role;

    @IsNotEmpty({ message: 'El nombre es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    firstName: string;

    @IsNotEmpty({ message: 'El apellido es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    lastName: string;

    @IsNotEmpty({ message: 'El telefono es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    phoneNumber: string;

    @IsBoolean()
    isActive: boolean;
}
