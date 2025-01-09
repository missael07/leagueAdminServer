import { Transform } from "class-transformer";
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { Role } from "src/common/enums/roles/role.enum";
import { StringUtil } from "src/common/utils/clean.service";


export class CreateUserDto {

    @IsEmail({}, { message: 'Ingrese un correo electronico valido.'})
    @IsNotEmpty({ message: 'Correo electronico es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    email: string;

    @IsNotEmpty({ message: 'El rol es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    role: Role;

    @IsNotEmpty({ message: 'Role should not be empty.' })
    @Transform(({ value }) => StringUtil.clean(value))
    companyId: string;

}
