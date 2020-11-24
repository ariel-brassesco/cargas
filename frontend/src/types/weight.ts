import { Base } from "./base";

export interface Weight extends Base {
  order: number;
  package: number;
  carton: number;
  primary_package: number;
  product: number;
}
