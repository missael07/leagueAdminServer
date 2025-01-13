import { Role } from "src/common/enums/roles/role.enum";

export interface TeamResponse {
    id: number;
    name: string;
    isActive: boolean;
    isPaid: boolean;
    category: number;
    categoryName: string;
    branch: number;
    branchName: string;
}

export interface UsersTeam {
    teamId:   number;
    name:     string;
    isActive: boolean;
    isPaid:   boolean;
    managers: Manager[];
}

export interface Manager {
    name: string;
    email:  string;
    role:  Role;
    phoneNumber: number;
}
