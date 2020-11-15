import { Base } from "./base";

export interface Temperature extends Base {
    order: number;
    row: number;
    temp: number;
}