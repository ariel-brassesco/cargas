import { Base } from "./base";
import { Product } from "./product";

export interface Row extends Base {
  order: number;
  number: number;
  product: Product;
  quantity: number;
  image: string;
  size: string;
}
