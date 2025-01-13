import { Role } from "../enums/roles/role.enum";

export interface JWTPayload {
    id: number;
    userName: string;
    role: Role;
    // TODO: add additional user information.
    
}