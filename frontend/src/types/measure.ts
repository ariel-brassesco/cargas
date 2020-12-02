import { Base } from "./base";
import { ImageControl } from "./images";

export interface Measure extends Base {
  order: number;
  comment: string;
  images: ImageControl[];
}
