import { Base } from "./base";
import { ImageControl } from "./images";

export interface Weight extends Base {
  order: number;
  package: number;
  carton: number;
  primary_package: number;
  product: number;
  images: ImageControl[];
}
