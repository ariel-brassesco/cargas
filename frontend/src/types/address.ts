import { Base } from "./base";

export interface Address extends Base {
    address?: string,
    lat?: number,
    lon?: number,
    elev?: number
}