import { string } from "yup";
import { Base } from "./base";

export interface Product extends Base {
    name: string;
}