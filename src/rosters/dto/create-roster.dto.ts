import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { StringUtil } from "src/common/utils/clean.service";

export class CreateRosterDto {
        @IsNotEmpty({ message: 'El nombre es requerido.' })
        @Transform(({ value }) => StringUtil.clean(value))
        firstName: string;
    
        @IsNotEmpty({ message: 'El apellido es requerido.' })
        @Transform(({ value }) => StringUtil.clean(value))
        lastName: string;
        
        @IsNotEmpty({ message: 'La imagen es requerida.' })
        @Transform(({ value }) => StringUtil.clean(value))
        imgUrl: string;
    
        @IsNotEmpty({ message: 'Debe de tener un equipo asignado.' })
        @Transform(({ value }) => isNaN(value) || value === 0 ? '' : value)
        teamId: number;
}
