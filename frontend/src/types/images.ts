import { Base } from "./base";

export const controlMap: Record<string, string> = {
  temperature: "Temperatura",
  weight: "Peso",
  measure: "Organoléptico",
};

export interface ImageControl extends Base {
  order: number;
  control: string;
  number: number;
  image: string;
  display: boolean;
  upload_at: string;
}
