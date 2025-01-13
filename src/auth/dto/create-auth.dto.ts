import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty({ message: 'El usuario es requerido.' })
    userName: string;

    @IsNotEmpty({ message: 'La contraseña es requerida.' })
    password: string;
}
