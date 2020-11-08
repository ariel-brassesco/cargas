import { Base } from "./base";

export interface User extends Base {
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    user_type: string,
    is_active: boolean
}