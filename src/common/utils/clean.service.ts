import { User } from "src/users/entities/user.entity";

export class StringUtil {
    static clean(str: string): string {
        str = str ?? "";
        str = str.replace(/\r/g, "")
            .replace(/\n/g, "")
            .replace(/\t/g, "")
            .replace(/\b/g, "")
            .replace(/\f/g, "")
            .replace(/\v/g, "")
            .trim();
        return str;
    }

    static cleanPassword(str: string): string {
        str = str ?? "";
        str = str.replace(/\r/g, "")
            .replace(/\n/g, "")
            .replace(/\t/g, "")
            .replace(/\b/g, "")
            .replace(/\f/g, "")
            .replace(/\v/g, "")
            .replace(/\s+/g, '')
            .trim();
        return str;
    }

    static cleanPhone(str: string): string {
        str = StringUtil.clean(str)
            .replace(/\(/g, "")
            .replace(/\)/g, "")
            .replace(/ /g, "")
            .replace(/-/g, "");
        return str;
    }

    static cleanNumber(str: string): string {
        str = StringUtil.clean(str)
            .replace(/,/g, "")
            .replace(/\$/g, "");
        return str;
    }

    static cleanSeparators(address: string): string {
        return address.replace(/[.,\/\\#&'_-\s]/g, '').trim();
    }

    static getLoggedUserFullName(user: User) {
        return `${user.firstName} ${user.lastName}`
    }
}