import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { StringUtil } from "src/common/utils/clean.service";

export class UpdateRosterDto {
    @IsNotEmpty({ message: 'El nombre es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    firstName: string;

    @IsNotEmpty({ message: 'El apellido es requerido.' })
    @Transform(({ value }) => StringUtil.clean(value))
    lastName: string;

    @IsBoolean()
    blockedToPlay: boolean;
    
    @IsBoolean()
    blockedToPitch: boolean;
    
    @IsBoolean()
    isReinforcement: boolean;

}
