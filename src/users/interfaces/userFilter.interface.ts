import { Category } from "src/common/enums/category/category.enum";
import { Role } from "src/common/enums/roles/role.enum";
import { Filter } from "src/common/interfaces/filter.interface";

export interface UserFilter extends Filter {
    category: Category;
    team: number;
    status: boolean
}