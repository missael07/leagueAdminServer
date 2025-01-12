import { Filter } from "src/common/interfaces/filter.interface";

export interface TeamFilter extends Filter {
    category?: string;
    branch?: string;
    isPaid?: string;
 }
