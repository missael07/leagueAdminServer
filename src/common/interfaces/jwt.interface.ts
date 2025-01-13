import { Role } from "../enums/roles/role.enum";

export interface JWTPayload {
    id: number;
    userName: string;
    role: Role;
    teamId: number
    // TODO: add additional user information.
    
}