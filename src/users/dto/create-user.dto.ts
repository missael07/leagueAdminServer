import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { Role } from "src/common/enums/roles/role.enum";
import { StringUtil } from "src/common/utils/clean.service";


export class CreateUserDto {

    @IsEmail({}, { message: 'Ingrese un correo electronico valido.'})
    @Transform(({ value }) => StringUtil.clean(value))
    email: string;

    @IsNotEmpty({ message: 'El rol es requerido.' })
    @Transform(({ value }) => isNaN(value) ? '' : value)
    roleId: Role;

    // @MinLength(6, { message: 'La contraseña debe de contener al menos 6 caracteres' })
    // @MaxLength(12, { message: 'La contraseña debe de contener maximo 16 caracteres' })
    // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //   message:
    //     'La contraseña debe de contener una minuscula, mayuscula, un numero y un caracter especial',
    // })
    // @IsNotEmpty({ message: 'La contraseña es requerida.' })
    // @Transform(({ value }) => StringUtil.cleanPassword(value))
    // password: string;
  

    @IsNotEmpty({ message: 'El nombre es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    firstName: string;

    @IsNotEmpty({ message: 'El apellido es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    lastName: string;

    @IsNotEmpty({ message: 'El telefono es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    phoneNumber: string;

    @IsNotEmpty({ message: 'Debe de tener un equipo asignado.' })
    @Transform(({ value }) => isNaN(value) || value === 0 ? '' : value)
    teamId: number;

}
