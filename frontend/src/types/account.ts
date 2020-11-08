import { Base } from "./base";
import {
    PROFILE_CLIENT,
    PROFILE_INSPECTOR,
    DASHBOARD
} from "../routes";

export const userTypeMapRoute: Record<string, string> = {
    IS_STAFF: DASHBOARD,
    IS_SUPERUSER: DASHBOARD,
    IS_INSPECTOR: PROFILE_INSPECTOR,
    IS_CLIENT: PROFILE_CLIENT,
};

export interface Account extends Base {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
}