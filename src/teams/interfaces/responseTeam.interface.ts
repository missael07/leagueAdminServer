import { Category } from "src/common/enums/category/category.enum";
import { Role } from "src/common/enums/roles/role.enum";
import { RosterResponse } from "src/rosters/interfaces/rosterResponse.interface";

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
    category: Category;
    branch:   string;
    managers: Manager[];
    rosters:  RosterResponse[]
}

export interface Manager {
    name: string;
    email:  string;
    role:  Role;
    phoneNumber: number;
}

export interface Roster {

}
