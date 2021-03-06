import { Base } from "./base";
import { ImageControl } from "./images";

export interface Temperature extends Base {
  order: number;
  row: number;
  temp: number;
  images: ImageControl[];
}
